/* eslint-disable */
import {
  CollectionCustomizer,
  TAggregation,
  TConditionTree,
  TPaginatedFilter,
  TPartialRow,
  TSortClause
} from '@forestadmin/agent';

export type FirmsCustomizer = CollectionCustomizer<Schema, 'firms'>;
export type FirmsRecord = TPartialRow<Schema, 'firms'>;
export type FirmsConditionTree = TConditionTree<Schema, 'firms'>;
export type FirmsFilter = TPaginatedFilter<Schema, 'firms'>;
export type FirmsSortClause = TSortClause<Schema, 'firms'>;
export type FirmsAggregation = TAggregation<Schema, 'firms'>;

export type TestCustomizer = CollectionCustomizer<Schema, 'test'>;
export type TestRecord = TPartialRow<Schema, 'test'>;
export type TestConditionTree = TConditionTree<Schema, 'test'>;
export type TestFilter = TPaginatedFilter<Schema, 'test'>;
export type TestSortClause = TSortClause<Schema, 'test'>;
export type TestAggregation = TAggregation<Schema, 'test'>;

export type TestAddressCustomizer = CollectionCustomizer<Schema, 'test_address'>;
export type TestAddressRecord = TPartialRow<Schema, 'test_address'>;
export type TestAddressConditionTree = TConditionTree<Schema, 'test_address'>;
export type TestAddressFilter = TPaginatedFilter<Schema, 'test_address'>;
export type TestAddressSortClause = TSortClause<Schema, 'test_address'>;
export type TestAddressAggregation = TAggregation<Schema, 'test_address'>;

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
  'firms': {
    plain: {
      'name': string;
      'slug': string;
      'website': string;
      'email': string;
      'extraNameLine': string;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {};
    flat: {};
  };
  'lawyers': {
    plain: {
      'hidden': boolean;
      'firstName': string;
      'lastName': string;
      'title': string;
      'yearOfBirth': string;
      'gender': string;
      'lawyerAdmissionYear': string;
      'email': string;
      'phone': string;
      'lawyerAdmissionCanton': string;
      'lawyerRegistryCanton': string;
      'firmFunction': string;
      'mediator': boolean;
      'memberships': Array<string>;
      'slug': string;
      'available': boolean;
      'hasFirstConsultation': boolean;
      'firstConsultationDuration': string;
      'hasHourlyRate': boolean;
      'hourlyRate': string;
      'hideAge': boolean;
      'signUpStatus': string;
      'languages': Array<{value: {lang: string; kind: string}}>;
      'profileText': {manual: string; generated: string};
      'profileTextSelection': string;
      'practiceAreas': Array<{value: {practiceArea: {link: string; display: string; _id: string}; preference: number}}>;
      'accountType': string;
      'showClientMessageInEmail': boolean;
      'billing': {commission: {percentage: string; cap: string}; subscription: {invoiceChannel: string; stripeSubscriptionId: string; freeTrial: boolean}; stripeCustomerId: string; bexioContactId: number};
      'education': Array<{value: {title: string; university: string; date: string}}>;
      'experience': Array<{value: {from: string; to: string; function: string; office: string}}>;
      'publications': Array<{value: {title: string; publication: string; link: string}}>;
      'showContactData': boolean;
      'firstConsultationPrice': string;
      'termsOfUseAccepted': string;
      'specialCertificates': Array<string>;
      'poolClaimTemplate': string;
      'awards': Array<string>;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {};
    flat: {};
  };
  'offices': {
    plain: {
      'isMain': boolean;
      'phone': string;
      'fax': string;
      'latlng': {lat: string; lng: string};
      'address': {street: string; extraLine: string; municipality: string; town: string; zip: string; canton: string; cantonAbbr: string};
      'postbox': {nr: string; extraLine: string; city: string; zip: string};
      'lawyers': Array<string>;
      'firm': string;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {
      'firm__manyToOne': Schema['firms']['plain'] & Schema['firms']['nested'];
    };
    flat: {
      'firm__manyToOne:name': string;
      'firm__manyToOne:slug': string;
      'firm__manyToOne:website': string;
      'firm__manyToOne:email': string;
      'firm__manyToOne:extraNameLine': string;
      'firm__manyToOne:_id': string;
      'firm__manyToOne:createdAt': string;
      'firm__manyToOne:updatedAt': string;
    };
  };
  'test': {
    plain: {
      'firstName': string;
      'lastName': string;
      'slug': string;
      '_id': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {
      'address': Schema['test_address']['plain'] & Schema['test_address']['nested'];
    };
    flat: {
      'address:co': string;
      'address:streetNr': string;
      'address:postcode': number;
      'address:municipality': string;
      'address:_id': string;
      'address:parentId': string;
    };
  };
  'test_address': {
    plain: {
      'co': string;
      'streetNr': string;
      'postcode': number;
      'municipality': string;
      '_id': string;
      'parentId': string;
    };
    nested: {
      'parent': Schema['test']['plain'] & Schema['test']['nested'];
    };
    flat: {
      'parent:firstName': string;
      'parent:lastName': string;
      'parent:slug': string;
      'parent:_id': string;
      'parent:createdAt': string;
      'parent:updatedAt': string;
    };
  };
};
