import { TestModel } from "../models/Test";
import QuestionModel from "../models/Question";
import { Request, Response } from "express";
import UserModel from "../models/User";

export class TestController
{
    public async createTest(req:Request,res:Response)
    {
        try
        {
            let category = req.body.category;
            let size = Number(req.body.size);
            if(!size)
            {
                throw new Error("No size existed");
            }
            let email = req.body.email;
            let level = req.body.level;
            let startFrom = await TestController.getStartQuestion(email,level,category);
            console.log(startFrom);
            let allQuestions = await QuestionModel.find(
                {category : category, level:level}
                ).skip(startFrom).limit(size);

            console.log(allQuestions);
            // create new test and save it
            res.json(allQuestions);
        }
        catch(err)
        {
            console.log(err);
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


    static async getStartQuestion(email:string,level:string,category:string)
    {
        try
        {
            let ans = 0;
            let id = await UserModel.find({email:email},{_id:1});
            let previousQuestions = await TestModel.find(
                {
                    userId:id,
                    level:level,
                    category:category
                },
                {_id:0,numberOfQuestions:1}
            );

            for(let i = 0; i < previousQuestions.length;i++)
            {
                ans += previousQuestions[i].numberOfQuestions;
            }

            return ans;
        }
        catch(err)
        {
            throw new Error("something went wrong in getting the start question");
        }
        
        
    }


}