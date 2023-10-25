import { HookBeforeUpdateContext, HookBeforeCreateContext } from '@forestadmin/datasource-customizer';
import { Schema } from '../typings';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { signJWTToken } from './general';

export const signClientJWTToken = (userId: string, scope: string, type: string) => {
  const sevenDays = 60 * 24 * 60 * 7;
  const exp = Math.floor(Date.now() / 1000) + sevenDays;

  return jwt.sign(
    {
      exp,
      userId,
      scope,
      type,
    },
    process.env.COCKPIT_TOKEN_SECRET
  );
};

export const validateUniqueEmail = async (
  context: HookBeforeUpdateContext<Schema, 'clients'> | HookBeforeCreateContext<Schema, 'clients'>
) => {
  const email = (context as HookBeforeCreateContext<Schema, 'clients'>).data
    ? (context as HookBeforeCreateContext<Schema, 'clients'>).data[0].email
    : (context as HookBeforeUpdateContext<Schema, 'clients'>).patch.email;

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

export const clientBexioUpsert = async (clientId: string) => {
  const baseApiUrl = process.env.API_BASE_URL;
  return await axios({
    url: `${baseApiUrl}/client/${clientId}/bexio`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${signJWTToken()}`,
    },
  });
};
