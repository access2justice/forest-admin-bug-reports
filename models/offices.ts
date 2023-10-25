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
    phone: String,
    fax: String,
    latlng: {
      lat: String,
      lng: String,
    },
    address: {
      street: { type: String, required: true },
      extraLine: String,
      municipality: { type: String, required: true },
      town: String,
      zip: { type: String, required: true },
      canton: String,
      cantonAbbr: String,
    },
    postbox: {
      nr: String,
      extraLine: String,
      city: String,
      zip: String,
    },
    lawyers: { type: [Mongoose.Schema.Types.ObjectId], ref: 'lawyers' },
    firm: { type: Mongoose.Schema.Types.ObjectId, ref: 'firms', required: true },
  },
  {
    timestamps: true,
  }
);

export { OfficesInterface, officesSchema };
