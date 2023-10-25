import { Types } from 'mongoose';
import { nonGermanSlugify } from './general';
import { Schema } from '../typings';
import { HookBeforeCreateContext, HookBeforeUpdateContext } from '@forestadmin/datasource-customizer';
import { TConditionTreeBranch, TConditionTreeLeaf, WriteCustomizationContext } from '@forestadmin/agent';

export const setUniqueSlug = async (
  name: string,
  _id: string,
  context:
    | HookBeforeCreateContext<Schema, 'lawyers'>
    | HookBeforeUpdateContext<Schema, 'lawyers'>
    | HookBeforeCreateContext<Schema, 'firms'>
    | HookBeforeUpdateContext<Schema, 'firms'>
) => {
  let slug = `${nonGermanSlugify(name)}`;

  const conditions = [{ field: 'slug', value: slug, operator: 'Equal' }] as (
    | TConditionTreeLeaf<Schema, 'lawyers'>
    | TConditionTreeLeaf<Schema, 'firms'>
  )[];
  if (_id) conditions.push({ field: '_id', value: _id.toString(), operator: 'NotEqual' });

  const namesakeRecords = await context.collection.list(
    {
      conditionTree:
        conditions.length > 1
          ? {
              aggregator: 'And',
              conditions: conditions as any[],
            }
          : (conditions[0] as any),
    },
    ['_id']
  );

  if (namesakeRecords.length > 0) {
    slug = `${slug}-${new Types.ObjectId()}`;
  }

  if ((context as HookBeforeCreateContext<Schema, 'lawyers' | 'firms'>).data) {
    (context as HookBeforeCreateContext<Schema, 'lawyers' | 'firms'>).data[0].slug = slug;
  } else {
    (context as HookBeforeUpdateContext<Schema, 'lawyers' | 'firms'>).patch.slug = slug;
  }
};

export const getLawyerSlug = async (
  newName: {
    firstName?: string;
    lastName?: string;
  },
  context: WriteCustomizationContext<Schema, 'lawyers'>
) => {
  let { firstName, lastName } = newName;
  let recordId = (context.filter?.conditionTree as any)?.value;

  if (!firstName || !lastName) {
    const record = await context.collection.list(
      {
        conditionTree: { field: '_id', value: recordId, operator: 'Equal' },
      },
      ['firstName', 'lastName']
    );
    firstName = firstName || record[0].firstName;
    lastName = lastName || record[0].lastName;
  }

  return await getUniqueSlug(`${firstName} ${lastName}`, recordId, context);
};

export const getUniqueSlug = async (
  name: string,
  _id: string,
  context: WriteCustomizationContext<Schema, 'lawyers'> | WriteCustomizationContext<Schema, 'firms'>
) => {
  let slug = `${nonGermanSlugify(name)}`;

  const conditions = [{ field: 'slug', value: slug, operator: 'Equal' }] as (
    | TConditionTreeLeaf<Schema, 'lawyers'>
    | TConditionTreeLeaf<Schema, 'firms'>
  )[];
  if (_id) conditions.push({ field: '_id', value: _id.toString(), operator: 'NotEqual' });

  const namesakeRecords = await context.collection.list(
    {
      conditionTree:
        conditions.length > 1
          ? {
              aggregator: 'And',
              conditions: conditions as any[],
            }
          : (conditions[0] as any),
    },
    ['_id']
  );

  if (namesakeRecords.length > 0) {
    slug = `${slug}-${new Types.ObjectId()}`;
  }

  return slug;
};
