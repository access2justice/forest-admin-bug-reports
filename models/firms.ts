import Mongoose from 'mongoose';

interface FirmsInterface {
  name: string;
  slug: string;
  website?: string;
  email?: string;
  extraNameLine?: string;
}

const FirmsSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: String,
    website: String,
    email: { type: String, required: true },
    extraNameLine: String,
  },
  {
    timestamps: true,
  }
);

export { FirmsInterface, FirmsSchema };