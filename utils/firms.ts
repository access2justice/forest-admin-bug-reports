import {
  HookAfterCreateContext,
  HookBeforeUpdateContext,
  HookBeforeDeleteContext,
  HookAfterDeleteContext,
} from '@forestadmin/datasource-customizer';
import { Schema } from '../typings';
import { TFieldName } from '@forestadmin/datasource-customizer';
import { EventTypes, triggerEvent } from './events';

export const buildAndStoreEventObjectForUpdate = async (
  context: HookBeforeUpdateContext<Schema, 'firms'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allFirmFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'firms'>[];
  const currentFirm = (await context.collection.list(context.filter, allFirmFields))[0];
  const newValues = context.patch;
  const previousValues = {};
  Object.keys(newValues).forEach((k) => {
    previousValues[k] = currentFirm[k];
  });

  recordsBeforeByRequestId.set(context.caller.requestId, { previousValues, objectId: currentFirm._id });
};

export const buildAndSendEventObjectForCreation = async (context: HookAfterCreateContext<Schema, 'firms'>) => {
  await triggerEvent(EventTypes.Firm.Created, {
    objectId: context.records[0]._id,
  });
};

export const buildAndStoreEventObjectForDeletion = async (
  context: HookAfterDeleteContext<Schema, 'firms'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allFirmFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'firms'>[];
  const currentFirm = (await context.collection.list(context.filter, allFirmFields))[0];

  recordsBeforeByRequestId.set(context.caller.requestId, { previousValues: currentFirm, objectId: currentFirm._id });
};

export const validateLinkedFirmsForDeletion = async (context: HookBeforeDeleteContext<Schema, 'firms'>) => {
  const offices = await context.dataSource
    .getCollection('offices')
    .list({ conditionTree: { field: 'firm', operator: 'Equal', value: (context.filter.conditionTree as any).value } }, [
      '_id',
    ]);
  if (offices.length > 0) context.throwValidationError('First delete all the offices for this firm.');
};
