import { extractPaymentStatuses } from '../legal-product-orders';

const records = [
  { _id: '64de5d05447500761b1544f8' }, // Unpaid
  { _id: '64db2ac7951cdcf8e82e8af2' }, // Partial
  { _id: '64db29cb951cdcf8e82e8ad6' }, // Partial
  { _id: '64db2467951cdcf8e82e8ab6' }, // Paid
  { _id: '64d49571b26aaedfaa1d63ae' }, // Partial
  { _id: '64d49571b26aaedfaa1d63ass' }, // Partial
];

const invoices = [
  { content__manyToOne: { status: 'Draft' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'Pending' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'Cancelled' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'Unpaid' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'Unknown' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'open' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'draft' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'void' }, parentId: '64de5d05447500761b1544f8' },
  { content__manyToOne: { status: 'uncollectible' }, parentId: '64de5d05447500761b1544f8' },

  { content__manyToOne: { status: 'Draft' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'Pending' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'Cancelled' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'Unpaid' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'Unknown' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'open' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'draft' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'void' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'uncollectible' }, parentId: '64db2ac7951cdcf8e82e8af2' },
  { content__manyToOne: { status: 'Partial' }, parentId: '64db2ac7951cdcf8e82e8af2' },

  { content__manyToOne: { status: 'Draft' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'Pending' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'paid' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'Unpaid' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'Unknown' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'open' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'draft' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'Paid' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'uncollectible' }, parentId: '64db29cb951cdcf8e82e8ad6' },
  { content__manyToOne: { status: 'Partial' }, parentId: '64db29cb951cdcf8e82e8ad6' },

  { content__manyToOne: { status: 'paid' }, parentId: '64db2467951cdcf8e82e8ab6' },
  { content__manyToOne: { status: 'Cancelled' }, parentId: '64db2467951cdcf8e82e8ab6' },
  { content__manyToOne: { status: 'void' }, parentId: '64db2467951cdcf8e82e8ab6' },
  { content__manyToOne: { status: 'draft' }, parentId: '64db2467951cdcf8e82e8ab6' },
  { content__manyToOne: { status: 'Paid' }, parentId: '64db2467951cdcf8e82e8ab6' },
  { content__manyToOne: { status: 'uncollectible' }, parentId: '64db2467951cdcf8e82e8ab6' },

  { content__manyToOne: { status: 'paid' }, parentId: '64d49571b26aaedfaa1d63ae' },
  { content__manyToOne: { status: 'Paid' }, parentId: '64d49571b26aaedfaa1d63ae' },
  { content__manyToOne: { status: 'Partial' }, parentId: '64d49571b26aaedfaa1d63ae' },
  { content__manyToOne: { status: 'Paid' }, parentId: '64d49571b26aaedfaa1d63ae' },

  { content__manyToOne: { status: 'cancelled' }, parentId: '64d49571b26aaedfaa1d63ass' },
  { content__manyToOne: { status: 'draft' }, parentId: '64d49571b26aaedfaa1d63ass' },
  { content__manyToOne: { status: 'void' }, parentId: '64d49571b26aaedfaa1d63ass' },
  { content__manyToOne: { status: 'uncollectible' }, parentId: '64d49571b26aaedfaa1d63ass' },
] as any[];

describe('common utils - sortObjectByKeys', () => {
  test('should return sorted object', () => {
    expect(extractPaymentStatuses(records, invoices)).toEqual([
      'Unpaid',
      'Partial',
      'Partial',
      'Paid',
      'Partial',
      undefined,
    ]);
  });
});
