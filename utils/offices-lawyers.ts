import {
  HookAfterCreateContext,
  HookBeforeCreateContext,
  HookBeforeDeleteContext,
} from '@forestadmin/datasource-customizer';
import { Schema } from '../typings';
import { TFieldName } from '@forestadmin/datasource-customizer';
import { unflatObject } from './general';

export const buildAndStoreEventFormerObjectForCreation = async (
  context: HookBeforeCreateContext<Schema, 'offices_lawyers'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const lawyerId = context.data[0].content;

  const formerOffice = (
    await context.dataSource
      .getCollection('offices')
      .list({ conditionTree: { field: 'lawyers', operator: 'In', value: [lawyerId] } }, ['firm'])
  )[0];

  const firmId = formerOffice?.firm;

  if (firmId) {
    const allOfficesFields = Object.entries(context.dataSource.getCollection('offices').schema.fields)
      .filter((v) => v[1].type === 'Column')
      .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];

    const siblingOffices = await context.dataSource
      .getCollection('offices')
      .list({ conditionTree: { field: 'firm', value: firmId, operator: 'Equal' } }, allOfficesFields);

    recordsBeforeByRequestId.set(`${context.caller.requestId}-update-former-firm`, {
      previousValues: {
        offices: siblingOffices.map((o) => unflatObject(o)),
      },
      objectId: firmId,
    });
  }
};

export const buildAndStoreEventTargetObjectForCreation = async (
  context: HookBeforeCreateContext<Schema, 'offices_lawyers'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const targetOfficeId = context.data[0].parentId;
  const targetOffice = (
    await context.dataSource.getCollection('offices').list(
      {
        conditionTree: {
          field: '_id',
          operator: 'Equal',
          value: targetOfficeId,
        },
      },
      ['firm']
    )
  )[0];
  const firmId = targetOffice?.firm;

  if (firmId) {
    const allOfficesFields = Object.entries(context.dataSource.getCollection('offices').schema.fields)
      .filter((v) => v[1].type === 'Column')
      .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];

    const offices = await context.dataSource
      .getCollection('offices')
      .list({ conditionTree: { field: 'firm', operator: 'Equal', value: firmId } }, allOfficesFields);

    recordsBeforeByRequestId.set(`${context.caller.requestId}-update-target-firm`, {
      previousValues: {
        offices: offices.map((o) => unflatObject(o)),
      },
      objectId: firmId,
    });
  }
};

export const buildAndStoreEventFormerObjectForDeletion = async (
  context: HookBeforeDeleteContext<Schema, 'offices_lawyers'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const link = (await context.collection.list(context.filter, ['parentId']))[0];
  const targetOffice = (
    await context.dataSource.getCollection('offices').list(
      {
        conditionTree: {
          field: '_id',
          operator: 'Equal',
          value: link.parentId,
        },
      },
      ['firm']
    )
  )[0];
  const firmId = targetOffice?.firm;

  if (firmId) {
    const allOfficesFields = Object.entries(context.dataSource.getCollection('offices').schema.fields)
      .filter((v) => v[1].type === 'Column')
      .map((v) => v[0]) as TFieldName<Schema, 'offices'>[];

    const offices = await context.dataSource
      .getCollection('offices')
      .list({ conditionTree: { field: 'firm', operator: 'Equal', value: firmId } }, allOfficesFields);

    recordsBeforeByRequestId.set(`${context.caller.requestId}`, {
      previousValues: {
        offices: offices.map((o) => unflatObject(o)),
      },
      objectId: firmId,
    });
  }
};

export const disassociateFormerFirm = async (context: HookAfterCreateContext<Schema, 'offices_lawyers'>) => {
  const lawyerId = context.data[0].content;
  const targetOfficeId = context.data[0].parentId;

  const offices = await context.dataSource
    .getCollection('offices')
    .list({ conditionTree: { field: 'lawyers', operator: 'In', value: [lawyerId] } }, ['_id']); // CHECK THIS!

  const formerOffices = offices.filter((o) => o._id !== targetOfficeId);
  if (formerOffices.length > 0) {
    await context.dataSource.getCollection('offices').delete({
      conditionTree: {
        field: '_id',
        operator: 'In',
        value: formerOffices.map((o) => o._id),
      },
    });
  }
};
