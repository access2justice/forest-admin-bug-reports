import Mongoose from 'mongoose';
import { officesSchema, OfficesInterface } from './offices';
import { LawyersInterface, LawyersSchema } from './lawyers';

const connection = Mongoose.createConnection(process.env.DATABASE_URL);

export const lawyers = connection.model<LawyersInterface>('lawyers', LawyersSchema, 'collections_lawyers');
export const offices = connection.model<OfficesInterface>('offices', officesSchema, 'offices');

export default connection;
