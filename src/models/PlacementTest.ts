import mongoose, { Schema, Document } from 'mongoose';

interface IPlacementTest extends Document {
  question: string;
  choices: string[];
  answer: string;
}

const PlacementTest: Schema = new Schema({
  question: {
    type: String,
    required: true,
  },
  choices: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const PlacementTestModel = mongoose.model<IPlacementTest>('Placement Test', PlacementTest);

export default PlacementTestModel;