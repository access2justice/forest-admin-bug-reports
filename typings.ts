/* eslint-disable */
import {
  CollectionCustomizer,
  TAggregation,
  TConditionTree,
  TPaginatedFilter,
  TPartialRow,
  TSortClause
} from '@forestadmin/agent';

export type TestCustomizer = CollectionCustomizer<Schema, 'test'>;
export type TestRecord = TPartialRow<Schema, 'test'>;
export type TestConditionTree = TConditionTree<Schema, 'test'>;
export type TestFilter = TPaginatedFilter<Schema, 'test'>;
export type TestSortClause = TSortClause<Schema, 'test'>;
export type TestAggregation = TAggregation<Schema, 'test'>;


export type Schema = {
  'test': {
    plain: {
      'firstName': string;
      'lastName': string;
      'slug': string;
      '_id': string;
    };
    nested: {};
    flat: {};
  };
};
