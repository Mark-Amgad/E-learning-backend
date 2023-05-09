import { ITest, TestModel } from "../models/Test";
import QuestionModel from "../models/Question";
import { Request, Response } from "express";
import UserModel,{User} from "../models/User";

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

            let allQuestions = await QuestionModel.find(
                {category : category, level:level},
                {_id:1}
                ).skip(startFrom).limit(size);

            //console.log(allQuestions);
            // get userId
            let user = await UserModel.find({email:email},{_id:1});
            let userId = user[0]._id;


            let newTest = new TestModel({
                userId: userId,
                questions: allQuestions,
                category:category,
                level:level,
                numberOfQuestions : size
            });
            await newTest.save();
            let result = await newTest.populate("questions");
            //console.log(result);
            res.json(result);
        }
        catch(err)
        {
            console.log(err);
            res.json("Error");
        }
    }

    async getTests(req:Request,res:Response)
    {
        try
        {
            let email:string = req.params.email;
            let id = await UserModel.find({email:email},{_id:1});
            let tests:ITest[] = await TestModel.find({userId:id});
            res.json(tests);
        }
        catch(err)
        {
            res.json("Error");
        }
    }

    async submitTest(req:Request,res:Response)
    {
        try
        {
            let answers:string[][] = req.body.answers;
            let testId:string = req.body.testId;
            await TestModel.updateOne({_id:testId},{answers:answers});
            let questionInTest = await TestModel.find({_id:testId},{questions:1}).populate("questions");
            console.log(questionInTest);
            //let score = TestController.evaluate(answers,trueAnswers);
            res.json({"all questions":questionInTest});

        }
        catch(err)
        {
            res.json("error");
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

    static evaluate(answers:string[][] , trueAnswers:string[][]):number
    {
        let score = 0;
        for(let i = 0 ; i < answers.length;i++)
        {
            for(let j = 0 ; j < answers[i].length;j++)
            {
                if(answers[i][j] == trueAnswers[i][j])
                {
                    score++;
                }
            }
        }
        return score;
    }




    


}