import Mongoose from 'mongoose';

interface OfficesInterface {
  isMain: boolean;
  phone: string;
  fax: string;
  latlng: {
    lat: object;
    lng: object;
  };
  address: {
    street: string;
    extraLine: string;
    municipality: string;
    town: string;
    zip: string;
    canton: string;
    cantonAbbr: string;
  };
  lawyers: Array<Mongoose.Types.ObjectId>;
  firm: Mongoose.Types.ObjectId;
}

const officesSchema = new Mongoose.Schema(
  {
    isMain: Boolean,
    street: { type: String, required: true },
    municipality: { type: String, required: true },
    zip: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export { OfficesInterface, officesSchema };
