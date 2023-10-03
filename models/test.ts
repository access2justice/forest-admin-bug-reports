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
}, {
  timestamps: false,
});

export { TestInterface, testSchema };
