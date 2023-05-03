import QuestionModel from "../models/Question"
import McqCompleteQuestionModel from "../models/McqComQuestion"
import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";
import { Request, Response } from "express";
let transfer = async(req:Request,res:Response)=>{
    try
    {
        
        //let LRQuestions = await ListeningReadingQuestionModel.find({},{_id:0});
        //await QuestionModel.insertMany(mcqQuestions);
        //await QuestionModel.insertMany(LRQuestions);

        let mcqQuestions = await McqCompleteQuestionModel.find({},{_id:0});
        await QuestionModel.insertMany(mcqQuestions);


        // NOTE : the bext statment delete everything in the destiny collection
        /*
        let pipline = [
            {$project:{question:"$header", url:"$ImageUrl",subQuestions:"$questions",category:1,level:1}},
            {$out:"questions"}
        ];
        let result = await ListeningReadingQuestionModel.aggregate(pipline);
        */
        
        res.json({"2":"added"});
    }
    catch(err)
    {
        console.log(err);
    }
}

export {transfer};

