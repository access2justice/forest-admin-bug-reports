import Mongoose from 'mongoose';

interface LawyersInterface {
  firstName: string;
  lastName: string;
  office: Mongoose.Schema.Types.ObjectId;
}

const LawyersSchema = new Mongoose.Schema(
  {
    office: { type: Mongoose.Schema.Types.ObjectId, ref: 'offices' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export { LawyersInterface, LawyersSchema };
