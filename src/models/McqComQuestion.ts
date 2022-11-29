import {Schema, model} from "mongoose";

export interface McqCompleteQuestion
{
    question:string,
    choices:string[],
    answer:string,
    type:string,
    category:string,
    level:string
}

const McqCompleteQuestionSchema = new Schema<McqCompleteQuestion>({
    question:{type:String, required:true},
    choices:[{type:String, required:true}],
    answer:{type:String, required:true},
    type:{type:String, required:true},
    category:{type:String, required:true},
    level:{type:String, required:true}
});


const McqCompleteQuestionModel = model<McqCompleteQuestion>("McqCompQuestion",McqCompleteQuestionSchema);
export default McqCompleteQuestionModel;