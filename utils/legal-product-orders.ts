import { ActionContextSingle, TRow, ActionContext, DynamicField } from '@forestadmin/agent';
import { Schema } from '../typings';
import { nonGermanSlugify, signJWTToken } from './general';
import axios from 'axios';

const createLegalProductOrder = async (body) => {
  const baseApiUrl = process.env.API_BASE_URL;
  return (
    await axios({
      url: `${baseApiUrl}/legal-products`,
      method: 'POST',
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signJWTToken()}`,
      },
    })
  ).data.response;
};

export const extendLegalProductOrder = async (body, id: string) => {
  const baseApiUrl = process.env.API_BASE_URL;
  return (
    await axios({
      url: `${baseApiUrl}/legal-products/${id}`,
      method: 'PUT',
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signJWTToken()}`,
      },
    })
  ).data.response;
};

export const extractPaymentStatuses = (
  records: Partial<TRow<Schema, 'legalProductOrders'>>[],
  invoices: Partial<TRow<Schema, 'legalProductOrders_invoices'>>[]
) =>
  records.map((r) => {
    let statuses = invoices
      .filter((i) => i.parentId === r._id.toString())
      .reduce((p: string, c: any) => {
        const currentStatus = c['content__manyToOne']?.status;
        return p + '|' + nonGermanSlugify(currentStatus);
      }, '');

    statuses = statuses
      .replace(/draft/g, '')
      .replace(/cancelled/g, '')
      .replace(/canceled/g, '')
      .replace(/void/g, '')
      .replace(/uncollectible/g, '');

    if (statuses.replace(/\|/g, '') === '') return undefined;
    else if (statuses.replace(/paid/g, '').replace(/\|/g, '') === '') return 'Paid';
    else if (statuses.replace(/unpaid/g, '').includes('paid') || statuses.includes('partial')) return 'Partial';
    else return 'Unpaid';
  });

export const changeCart = (items: string[]) => {
  const newItem = !/\(\d*x\) /.test(items[items.length - 1]) && items[items.length - 1];

  if (newItem) {
    let tail = items;
    tail = items.slice(0, -1);
    if (tail.find((i) => i.includes(newItem))) {
      items = tail;
    }
    return items.map((i: string) => {
      if (newItem && i.includes(newItem)) {
        let count = 1;
        if (/\(\d*x\) /.test(i)) {
          count = parseInt(i.split('(')[1].split('x')[0]) + 1;
        }
        const product = i.split(/\(\d*x\) /).filter((s) => s)[0];
        return `(${count}x) ${product}`;
      }
      return i;
    });
  }

  return items;
};

export const readCart = async (
  context:
    | ActionContext<Schema, 'legalProductOrders'>
    | ActionContextSingle<Schema, 'clients'>
    | ActionContextSingle<Schema, 'legalProductOrders'>
): Promise<TRow<Schema, 'legalProductItems'>[]> => {
  const legalProductItems = await context.dataSource
    .getCollection('legalProductItems')
    .list({}, ['intern_code', 'intern_name', 'sale_price', 'legalProduct:slug']);
  const items = context.formValues['items'] || [];
  const result = items.map((i: string) => {
    let productWithPrice = i;
    let count = 1;
    if (/\(\d*x\) /.test(i)) {
      productWithPrice = i.split('x) ')[1];
      count = parseInt(i.split('(')[1].split('x')[0]);
    }
    let productName = productWithPrice.split(' ⎯ CHF ')[0];
    return Array(count)
      .fill(undefined)
      .map((_) => legalProductItems.find((lPI) => lPI.intern_name === productName));
  });
  return result.flat().filter((a: string) => a);
};

export const executeLegalProductOrderSubmission = async (
  context: ActionContext<Schema, 'legalProductOrders'> | ActionContextSingle<Schema, 'clients'>,
  resultBuilder: any // ResultBuilder
) => {
  const cart = await readCart(context);
  const paths = context.formValues['Path'] || [];
  const consent = context.formValues['Deals & Consent'] || [];
  let clientId = '';

  if (context.formValues['Client']) {
    clientId = context.formValues['Client'][0] as string;
  } else {
    clientId = (await (context as ActionContextSingle<Schema, 'clients'>).getRecordId()) as string;
  }

  const data = {} as any;

  if (consent.includes('consentZKB')) {
    data.consentZKB = true;
  }

  if (consent.includes('consentKonsento')) {
    data.consentKonsento = true;
  }

  if (consent.includes('consentBexio')) {
    data.consentBexio = true;
  }

  let coupon: string | undefined = undefined;

  if (consent.includes('consentZKB')) {
    if (
      cart.find((p) => p.intern_code.includes('stock-corporation')) ||
      cart.find((p) => p.intern_code.includes('llc'))
    ) {
      data.creditZKB = '380';
      coupon = 'ZKB380';
    }
    if (cart.find((p) => p.intern_code.includes('sole-proprietorship'))) {
      data.creditZKB = '50';
      coupon = 'ZKB50';
    }
  }

  const body = {
    legalProductItems: cart.map((i) => i.intern_code),
    client: clientId,
    data,
    source: paths.reduce((p: string, c: string) => `${p}${c}|`, 'forestadmin|'),
    coupon,
    noSend: !(context.formValues['Invoice'] === 'true'),
  };

  const newOrder = await createLegalProductOrder(body);

  return resultBuilder.redirectTo(
    `/jurata/${process.env.FOREST_ENVIRONMENT}/Operations/data/legalProductOrders/index/record/legalProductOrders/${newOrder._id}/details`
  );
};

export const getUnprocessedRecords = async (context: ActionContext<Schema, 'legalProductOrders'>) => {
  const orders = await context.getRecords(['fulfillmentStatus', '_id', 'title']);
  const invoices = await context.dataSource.getCollection('legalProductOrders_invoices').list(
    {
      conditionTree: {
        field: 'parentId',
        operator: 'In',
        value: orders.map((r) => r._id),
      },
    },
    [
      'content',
      'content__manyToOne:paymentProcessed',
      'content__manyToOne:status',
      'content__manyToOne:bexioInvoice:network_link',
      'content__manyToOne:bexioInvoice:id',
    ]
  );

  const unfulfilledOrders = orders.filter((o) => o.fulfillmentStatus === 'Not Started');

  const unprocessedPayments = invoices.filter(
    (i) => i.content__manyToOne?.status?.toLowerCase() === 'paid' && !i.content__manyToOne?.paymentProcessed
  );

  return { unfulfilledOrders, unprocessedPayments };
};

export const sliceStrong = (s: string) => {
  const split = s.split('</strong>');
  if (split.length > 1) {
    return split[0].replace('<strong>', '');
  }
  return s;
};

export const submitOrderForm:
  | DynamicField<ActionContextSingle<Schema, 'clients'>>[]
  | DynamicField<ActionContext<Schema, 'legalProductOrders'>>[] = [
  {
    label: 'items',
    type: 'StringList',
    widget: 'Dropdown',
    placeholder: 'Choose one or several ...',
    search: 'static',
    isRequired: true,
    options: async (context) => {
      const legalProductItems = await context.dataSource
        .getCollection('legalProductItems')
        .list({}, ['intern_code', 'intern_name', 'sale_price']);
      return [
        ...legalProductItems.map((lPI) => `${lPI['intern_name']} ⎯ CHF ${parseInt(lPI['sale_price'])}`).sort(),
        ...changeCart(context.formValues['items'] || []),
      ];
    },
    value: (context) => changeCart(context.formValues['items'] || []),
  },
  {
    label: 'Subtotal (CHF)',
    type: 'Number',
    isReadOnly: true,
    value: async (context) => {
      const cart = await readCart(context);
      let discount = 0;
      /* Doesn't work.
      const consent = context.formValues['Deals & Consent'] || [];
      if (consent.includes('consentZKB')) {
        if (
          cart.find((p) => p.intern_code.includes('stock-corporation')) ||
          cart.find((p) => p.intern_code.includes('llc'))
        ) {
          discount = 380;
        } else if (cart.find((p) => p.intern_code.includes('sole-proprietorship'))) {
          discount = 50;
        }
      }
      */
      return cart.reduce((p, c) => p + (parseInt(c.sale_price) || 0), 0) - discount;
    },
  },
  {
    label: 'Deals & Consent',
    description: 'Does the lead have interest in our partner deals and consents, that we forward their data?',
    type: 'StringList',
    widget: 'CheckboxGroup',
    options: async (context) => {
      const consent = [];
      const cart = await readCart(context);

      if (cart.find((p) => p.intern_code.includes('stock-corporation'))) {
        consent.push({ value: 'consentZKB', label: 'ZKB (CHF 380 Rabatt)' });
        consent.push({ value: 'consentBexio', label: 'Bexio' });
        consent.push({ value: 'consentKonsento', label: 'Konsento' });
      } else if (cart.find((p) => p.intern_code.includes('llc'))) {
        consent.push({ value: 'consentZKB', label: 'ZKB (CHF 380 Rabatt)' });
        consent.push({ value: 'consentBexio', label: 'Bexio' });
      } else if (cart.find((p) => p.intern_code.includes('sole-proprietorship'))) {
        consent.push({ value: 'consentZKB', label: 'ZKB (CHF 50 Rabatt)' });
        consent.push({ value: 'consentBexio', label: 'Bexio' });
      }

      return consent;
    },
    isRequired: false,
  },
  {
    label: 'Path',
    description: 'Where did this lead originate?',
    type: 'StringList',
    widget: 'CheckboxGroup',
    options: async (context) => {
      return [
        { value: 'zkb', label: 'ZKB' },
        { value: 'consultation', label: 'Consultation' },
      ];
    },
    isRequired: false,
  },
  {
    label: 'Invoice',
    description: 'Should the Bexio invoice be sent out, or only drafted?',
    widget: 'Dropdown',
    type: 'String',
    options: [
      {
        label: 'Draft Invoice',
        value: 'false',
      },
      {
        label: 'Send Invoice',
        value: 'true',
      },
    ],
    isRequired: true,
  },
];
