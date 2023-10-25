import Mongoose from 'mongoose';

import { testSchema, TestInterface } from './test';
import { officesSchema, OfficesInterface } from './offices';
import { LawyersInterface, LawyersSchema } from './lawyers';
import { FirmsInterface, FirmsSchema } from './firms';

const connection = Mongoose.createConnection(process.env.DATABASE_URL);

export const firms = connection.model<FirmsInterface>('firms', FirmsSchema, 'collections_firms');
export const test = connection.model<TestInterface>('test', testSchema, 'test');
export const lawyers = connection.model<LawyersInterface>('lawyers', LawyersSchema, 'collections_lawyers');
export const offices = connection.model<OfficesInterface>('offices', officesSchema, 'offices');

export default connection;
