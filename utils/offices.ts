import {
  HookAfterCreateContext,
  HookBeforeCreateContext,
  HookBeforeUpdateContext,
  HookAfterDeleteContext,
  HookBeforeDeleteContext,
} from '@forestadmin/datasource-customizer';
import axios from 'axios';
import { Schema } from '../typings';
import { TFieldName } from '@forestadmin/datasource-customizer';
import { unflatObject } from './general';
import { EventTypes, triggerEvent } from './events';

export const setLocation = async (
  context: HookBeforeCreateContext<Schema, 'offices'> | HookBeforeUpdateContext<Schema, 'offices'>
) => {
  const existingOffice =
    (context as HookBeforeUpdateContext<Schema, 'offices'>).filter &&
    (
      await context.collection.list((context as HookBeforeUpdateContext<Schema, 'offices'>).filter, [
        'address@@@street',
        'address@@@municipality',
        'address@@@zip',
      ])
    )[0];

  const street =
    (context as HookBeforeCreateContext<Schema, 'offices'>).data?.slice(-1)[0]['address@@@street'] ||
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['address@@@street'] ||
    existingOffice?.['address@@@street'];
  const zip =
    (context as HookBeforeCreateContext<Schema, 'offices'>).data?.slice(-1)[0]['address@@@zip'] ||
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['address@@@zip'] ||
    existingOffice?.['address@@@zip'];
  const municipality =
    (context as HookBeforeCreateContext<Schema, 'offices'>).data?.slice(-1)[0]['address@@@municipality'] ||
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['address@@@municipality'] ||
    existingOffice?.['address@@@municipality'];

  const place = (
    await context.dataSource.getCollection('places').list(
      {
        conditionTree: { field: 'municipality', value: municipality, operator: 'Equal' },
      },
      ['canton']
    )
  )[0];

  const canton = (
    await context.dataSource.getCollection('cantons').list(
      {
        conditionTree: { field: '_id', value: place.canton, operator: 'Equal' },
      },
      ['name_de', 'cantonCode']
    )
  )[0];

  const latlng = await getCoordinates(street, zip, municipality);

  if ((context as HookBeforeCreateContext<Schema, 'offices'>).data) {
    (context as HookBeforeCreateContext<Schema, 'offices'>).data[0]['latlng'] = latlng;
    (context as HookBeforeCreateContext<Schema, 'offices'>).data[0]['address@@@canton'] = canton.name_de;
    (context as HookBeforeCreateContext<Schema, 'offices'>).data[0]['address@@@cantonAbbr'] = canton.cantonCode;
  } else {
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['latlng'] = latlng;
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['address@@@canton'] = canton.name_de;
    (context as HookBeforeUpdateContext<Schema, 'offices'>).patch['address@@@cantonAbbr'] = canton.cantonCode;
  }
};

export const getCoordinates = async (streetNr: string, zip: string, municipality: string) => {
  const address = `${streetNr}, ${zip} ${municipality}`;
  const response = await axios({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${
      process.env.GOOGLE_GEOCODING_API_KEY
    }`,
    method: 'GET',
  });
  if (response.data.status !== 'OK') throw new Error('No coordinates found for this address');
  return response.data.results[0] ? response.data.results[0].geometry.location : {};
};

export const buildAndStoreEventObjectForUpdate = async (
  context: HookBeforeUpdateContext<Schema, 'offices'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allOfficesFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];
  const currentOffice = (await context.collection.list(context.filter, allOfficesFields))[0];
  const firmId = context.patch.firm || currentOffice.firm;

  if (firmId) {
    const siblingOffices = await context.collection.list(
      { conditionTree: { field: 'firm', value: firmId, operator: 'Equal' } },
      allOfficesFields
    );

    recordsBeforeByRequestId.set(context.caller.requestId, {
      previousValues: {
        offices: siblingOffices.map((o) => unflatObject(o)),
      },
      objectId: firmId,
    });
  }
};

export const buildAndSendEventObjectForCreation = async (context: HookAfterCreateContext<Schema, 'offices'>) => {
  const newOffice = context.records[0];

  if (newOffice.firm) {
    const allOfficesFields = Object.entries(context.collection.schema.fields)
      .filter((v) => v[1].type === 'Column')
      .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];
    const siblingOffices = await context.collection.list(
      { conditionTree: { field: 'firm', value: newOffice.firm, operator: 'Equal' } },
      allOfficesFields
    );
    await triggerEvent(EventTypes.Firm.Updated, {
      previousValues: {
        offices: siblingOffices.map((o) => unflatObject(o)),
      },
      objectId: newOffice.firm,
    });
  }
};

export const buildAndStoreEventObjectForDeletion = async (
  context: HookBeforeDeleteContext<Schema, 'offices'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allOfficesFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];
  const currentOffice = (await context.collection.list(context.filter, ['firm']))[0];
  const firmId = currentOffice.firm;

  if (firmId) {
    const siblingOffices = await context.collection.list(
      { conditionTree: { field: 'firm', value: firmId, operator: 'Equal' } },
      allOfficesFields
    );

    recordsBeforeByRequestId.set(context.caller.requestId, {
      previousValues: {
        offices: siblingOffices.map((o) => unflatObject(o)),
      },
      objectId: firmId,
    });
  }
};

export const validateLinkedLawyersForDeletion = async (context: HookAfterDeleteContext<Schema, 'offices'>) => {
  const lawyers = await context.dataSource
    .getCollection('offices_lawyers')
    .list(
      { conditionTree: { field: 'parentId', operator: 'Equal', value: (context.filter.conditionTree as any).value } },
      ['_id']
    );
  if (lawyers.length > 0) context.throwValidationError('First delete all the lawyers for this office.');
};
