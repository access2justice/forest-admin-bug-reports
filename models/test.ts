import Mongoose from 'mongoose';

interface TestInterface {
  firstName: string;
  lastName: string;
  slug: string;
}

const testSchema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  slug: String,
  address: {
    co: { type: String, required: false },
    streetNr: { type: String, required: false },
    postcode: { type: Number, required: false },
    municipality: { type: String, required: false },
    _id: false 
  },
}, {
  timestamps: true,
});

export { TestInterface, testSchema };
