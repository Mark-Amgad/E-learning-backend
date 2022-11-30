import McqCompleteQuestionModel from "../models/McqComQuestion";
import express from "express";

export default class McqCompQuestionController {
    getAllMcqCompQuestions = async (req: express.Request, res: express.Response) => {
        try {
            const result = await McqCompleteQuestionModel.find();
            res.json({ questions: result });
        } catch (err) {
            res.send("error");
        }
    };

    /*
        createMcqCompQuestion = async(req:express.Request,res:express.Response)=>{
            try
            {
                const result = await new McqCompleteQuestionModel({
                    
                });
                res.json({"questions":result});
            }
            catch(err)
            {
                res.send("error");
            }
        };
        */
}
