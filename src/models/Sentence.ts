import {Schema, model} from "mongoose";

export interface Sentence
{
    text:string,
    level:string,
    tenses:string[],
}

const SentenceSchema = new Schema<Sentence>({
    text:{type:String, required:true},
    level:{type:String, required:true},
    tenses:{type:[String], required:true},
});


const SentenceModel = model<Sentence>("Sentence",SentenceSchema);
export default SentenceModel;