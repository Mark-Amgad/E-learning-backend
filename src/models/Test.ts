import { Schema, model, Document } from "mongoose";
import { IQuestion } from "./Question";

interface ITest extends Document {
  userId: string;
  questions: IQuestion[];
  answers: string[];
  score: number;
  category : string;
  level:string;
  createdAt: Date;
  numberOfQuestions:number;
}

const TestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    questions: [{ type: Schema.Types.ObjectId, required: true, ref: "Question" }],
    answers: [{ type: String }],
    score: { type: Number,default:0 },
    category: {type:String,require:true},
    level:{type:String,require:true},
    numberOfQuestions:{type:Number,require:true},
    createdAt: { type: Date, default: Date.now },
  },
);

const TestModel = model<ITest>("Test", TestSchema);

export { TestModel, ITest };
