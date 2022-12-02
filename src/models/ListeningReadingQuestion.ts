import mongoose, {Schema, model} from "mongoose";

// will be updated after adding authors
export interface ListeningReadingQuestion
{
    header:string,
    questions:{
        question:string,
        choices:string[],
        answer:string,
        type:string
    }[],
    hasImage:boolean,
    imageUrl:string,
    category:string,
    level:string,
}

const ListeningReadingQuestionSchema = new Schema<ListeningReadingQuestion>({
    header : {type:String , required:true},
    questions:[{type:Object,required:true}],
    hasImage:[{type:Boolean, required:true}],
    imageUrl:{type:String, required:false},
    category:{type:String, required:true},
    level:{type:String, required:true}
});



const ListeningReadingQuestionModel = model<ListeningReadingQuestion>("ListeningReadingQuestion",ListeningReadingQuestionSchema);
export default ListeningReadingQuestionModel;
