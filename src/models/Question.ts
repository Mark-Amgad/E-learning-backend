import {Schema, model,Document } from "mongoose";

export interface IQuestion extends Document
{
    question:string,
    subQuestions:{
        question:string,
        choices:string[],
        answer:string,
    }
    choices:string[],
    answer:string,
    type:string,
    category:string,
    level:string,
    url:string
}


const QuestionSchema = new Schema<IQuestion>({
    question:{type:String, required:true},
    subQuestions:[{
        type:{
            question:{type:String,required:true},
            choices:{type:[String],required:true},
            answer:{type:String,required:true},
        },
        required:false
    }],
    choices:[{type:String, required:false}],
    answer:{type:String, required:false},
    type:{type:String, required:true},
    category:{type:String, required:true},
    level:{type:String, required:true}
});


const QuestionModel = model<IQuestion>("Question",QuestionSchema);
export default QuestionModel;