import { TestModel } from "../models/Test";
import QuestionModel from "../models/Question";
import { Request, Response } from "express";

export class TestController
{
    async createTest(req:Request,res:Response)
    {
        try
        {
            let category = req.body.category;
            let size = Number(req.body.size);
            let allQuestions = await QuestionModel.find({category : category}).limit(10);
            console.log(allQuestions);
            allQuestions.sort(()=>Math.random()-0.5);
            //console.log(allQuestions);
            res.json(allQuestions);
        }
        catch(err)
        {
            res.json("Error");
        }
    }

    async getTest(req:Request,res:Response)
    {
        try
        {

        }
        catch(err)
        {
            
        }
    }

    async submitTest(req:Request,res:Response)
    {
        try
        {

        }
        catch(err)
        {
            
        }
    }

    async deleteTest(req:Request,res:Response)
    {
        try
        {

        }
        catch(err)
        {
            
        }
    }
}