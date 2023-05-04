import {Schema, model} from "mongoose";

export interface Paragraph
{
    text:string,
    level:string,
}

const ParagraphSchema = new Schema<Paragraph>({
    text:{type:String, required:true},
    level:{type:String, required:true},
});


const ParagraphModel = model<Paragraph>("Paragraph",ParagraphSchema);
export default ParagraphModel;