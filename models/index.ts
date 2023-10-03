import type { TestInterface } from './test';

import Mongoose from 'mongoose';

import { testSchema } from './test';

const connection = Mongoose.createConnection(process.env.DATABASE_URL);

export const test = connection.model<TestInterface>('test', testSchema, 'test');

export default connection;
