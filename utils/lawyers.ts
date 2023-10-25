import jwt from 'jsonwebtoken';
import {
  HookAfterCreateContext,
  HookBeforeUpdateContext,
  HookBeforeCreateContext,
  HookBeforeDeleteContext,
} from '@forestadmin/datasource-customizer';
import { Schema } from '../typings';
import { TFieldName } from '@forestadmin/datasource-customizer';
import { EventTypes, triggerEvent } from './events';

export const signLawyerJWTToken = (_id, email, scope, type) => {
  const sevenDays = 60 * 24 * 60 * 7;
  const exp = Math.floor(Date.now() / 1000) + sevenDays;

  return jwt.sign(
    {
      exp,
      data: JSON.stringify({ _id, email }),
      userId: _id,
      scope,
      type,
    },
    process.env.COCKPIT_TOKEN_SECRET
  );
};

export const validateUniqueEmail = async (
  context: HookBeforeUpdateContext<Schema, 'lawyers'> | HookBeforeCreateContext<Schema, 'lawyers'>
) => {
  const email = (context as HookBeforeCreateContext<Schema, 'lawyers'>).data
    ? (context as HookBeforeCreateContext<Schema, 'lawyers'>).data[0].email
    : (context as HookBeforeUpdateContext<Schema, 'lawyers'>).patch.email;

  if (!email) return;
  if (email.toLowerCase() !== email) context.throwValidationError('We can only accept e-mails in lower case.');

  const lawyers = await context.collection.list(
    { conditionTree: { field: 'email', operator: 'Equal', value: email } },
    ['_id']
  );
  if (lawyers.length > 0) {
    context.throwValidationError('There is a duplicate for this e-mail address, please use a unique one.');
  }
};

export const buildAndStoreEventObjectForUpdate = async (
  context: HookBeforeUpdateContext<Schema, 'lawyers'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allLawyerFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'lawyers'>[];
  const currentLawyer = (await context.collection.list(context.filter, allLawyerFields))[0];
  const newValues = context.patch;
  const previousValues = {};
  Object.keys(newValues).forEach((k) => {
    previousValues[k] = currentLawyer[k];
  });

  recordsBeforeByRequestId.set(context.caller.requestId, { previousValues, objectId: currentLawyer._id });
};

export const buildAndSendEventObjectForCreation = async (context: HookAfterCreateContext<Schema, 'lawyers'>) => {
  await triggerEvent(EventTypes.Lawyer.Created, {
    objectId: context.records[0]._id,
  });
};

export const buildAndStoreEventObjectForDelete = async (
  context: HookBeforeDeleteContext<Schema, 'lawyers'>,
  recordsBeforeByRequestId: Map<string, any>
) => {
  const allLawyerFields = Object.entries(context.collection.schema.fields)
    .filter((v) => v[1].type === 'Column')
    .map((v) => v[0]) as TFieldName<Schema, 'lawyers'>[];
  const currentLawyer = (await context.collection.list(context.filter, allLawyerFields))[0];

  recordsBeforeByRequestId.set(context.caller.requestId, {
    previousValues: currentLawyer,
    objectId: currentLawyer._id,
  });
};
