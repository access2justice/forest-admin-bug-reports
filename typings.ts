/* eslint-disable */
import {
  CollectionCustomizer,
  TAggregation,
  TConditionTree,
  TPaginatedFilter,
  TPartialRow,
  TSortClause
} from '@forestadmin/agent';

export type LawyersCustomizer = CollectionCustomizer<Schema, 'lawyers'>;
export type LawyersRecord = TPartialRow<Schema, 'lawyers'>;
export type LawyersConditionTree = TConditionTree<Schema, 'lawyers'>;
export type LawyersFilter = TPaginatedFilter<Schema, 'lawyers'>;
export type LawyersSortClause = TSortClause<Schema, 'lawyers'>;
export type LawyersAggregation = TAggregation<Schema, 'lawyers'>;

export type OfficesCustomizer = CollectionCustomizer<Schema, 'offices'>;
export type OfficesRecord = TPartialRow<Schema, 'offices'>;
export type OfficesConditionTree = TConditionTree<Schema, 'offices'>;
export type OfficesFilter = TPaginatedFilter<Schema, 'offices'>;
export type OfficesSortClause = TSortClause<Schema, 'offices'>;
export type OfficesAggregation = TAggregation<Schema, 'offices'>;


export type Schema = {
  'lawyers': {
    plain: {
      'office': string;
      'firstName': string;
      'lastName': string;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {
      'office__manyToOne': Schema['offices']['plain'] & Schema['offices']['nested'];
    };
    flat: {
      'office__manyToOne:isMain': boolean;
      'office__manyToOne:street': string;
      'office__manyToOne:municipality': string;
      'office__manyToOne:zip': string;
      'office__manyToOne:_id': string;
      'office__manyToOne:createdAt': string;
      'office__manyToOne:updatedAt': string;
      'office__manyToOne:name': string;
    };
  };
  'offices': {
    plain: {
      'isMain': boolean;
      'street': string;
      'municipality': string;
      'zip': string;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
      'name': string;
    };
    nested: {};
    flat: {};
  };
};
