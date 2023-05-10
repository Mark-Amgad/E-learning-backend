import {Schema, model} from "mongoose";

export interface GeneratedListeningQuestion
{
    path:string,
    level:string,
    answer:string,
    
}

const GeneratedListeningQuestionSchema = new Schema<GeneratedListeningQuestion>({
    path:{type:String, required:true},
    level:{type:String, required:true},
    answer:{type:String, required:true},
});


const GeneratedListeningQuestionModel = model<GeneratedListeningQuestion>("GeneratedListeningQuestion",GeneratedListeningQuestionSchema);
export default GeneratedListeningQuestionModel;