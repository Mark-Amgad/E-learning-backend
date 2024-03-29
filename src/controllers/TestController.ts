import { ITest, TestModel } from "../models/Test";
import QuestionModel, { IQuestion } from "../models/Question";
import { Request, Response } from "express";
import UserModel,{User} from "../models/User";
import PlacementTestModel from "../models/PlacementTest";

export class TestController
{
    public async createTest(req:Request,res:Response)
    {
        try
        {
            let category = req.params.category;
            let size = Number(req.params.size);
            if(!size)
            {
                throw new Error("No size existed");
            }
            let email = req.params.email;
            let level = req.params.level;
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
            let test = await TestModel.findById(testId).populate("questions");
            let testQuestions = test?.questions;
            // console.log(testQuestions);
            // console.log(testCategory);
            // get el correct answers .. 
            // if category grammar or vocabulary 
            let correctAnswers = TestController.getCorrectAnswers(testQuestions);
            let sizeCheck = TestController.checkOnSize(answers,correctAnswers);
            if(!sizeCheck)
            {
                return res.json({"error message" : "wrong answers size"});
            }
            //console.log(answers);
            //console.log(correctAnswers);
            // evaluate the answers
            // update score
            let [score,totalScore] = TestController.evaluate(answers,correctAnswers);
            await TestModel.updateOne({_id:testId},{
                answers:answers,
                score:score,
                numberOfQuestions:totalScore
            });
            res.json({"score":score,"total score":totalScore});

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

    async getTest(req:Request,res:Response)
    {
        try
        {
            let testId = req.params.test_id;
            let test = await TestModel.findById(testId).populate("questions");
            res.json(test);
        }
        catch(err)
        {
            res.json("error");
        }
    }

    async getPlacementTest(req:Request,res:Response)
    {
        try
        {
            let placementTest = await PlacementTestModel.find();
            res.json(placementTest);
        }
        catch(err)
        {
            res.json("error");
        }
    }

    async submitPlacementTest(req:Request,res:Response)
    {
        try
        {
            let answers:string[] = req.body.answers;
            let userId:string = req.body.userId;
            // getting the correct answers
            let placementTest = await PlacementTestModel.find({},{"answer":1,_id:0});
            let correctAnswers:string[] =[];
            placementTest.forEach((q)=>{correctAnswers.push(q.answer)});
            //console.log(correctAnswers);

            if(correctAnswers.length != answers.length)
            {
                return res.json({"message":"There is missing answers in the answers array(LENGTH)"});
            }
            // calculate score
            let score = 0;
            for(let i = 0 ; i<correctAnswers.length;i++)
            {
                if(correctAnswers[i] == answers[i])
                {
                    score++;
                }
            }
            // map score to level
            let level = 1;
            if(score >= 0 && score <= 20) level = 1;
            else if(score >= 21 && score <= 30) level = 2;
            else if(score >= 31 && score <= 40) level = 3;
            else if(score >= 41 && score <= 45) level = 4;
            else if(score >= 46 && score <= 49) level = 5;
            else if(score == 50) level = 6;
            //console.log(level);
            // update the user and return it
            let user = await UserModel.findByIdAndUpdate(userId,{"level":level},{ new: true });
            await user?.save();
            return res.json({"user":user});
            // evaluate test and get score

            // convert score to level
            // store the level in the user data
            // return the user
        }
        catch(err)
        {
            res.json("error");
        }
    }

    // create palcement test submition

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

    static evaluate(answers:string[][] , trueAnswers:string[][]):number[]
    {
        let score = 0;
        let totalScore = 0;
        for(let i = 0 ; i < trueAnswers.length;i++)
        {
            for(let j = 0 ; j < trueAnswers[i].length;j++)
            {
                if(answers[i][j] == trueAnswers[i][j])
                {
                    score++;
                }
                totalScore++;
            }
        }
        return [score , totalScore];
    }

    static getCorrectAnswers(questions:any)
    {
        let correctAnswers:string[][] = [];
        for(let i = 0; i < questions.length; i++)
        {
            if(questions[i].category == "Vocabulary"
            || questions[i].category == "Grammar"
            || questions[i].category == "Listening")
            {
                let answer = questions[i].answer;
                correctAnswers.push([answer]);
            }
            else
            {
                let vector = [];
                for(let j =0 ; j  < questions[i].subQuestions.length;j++)
                {
                    vector.push(questions[i].subQuestions[j].answer);
                }
                correctAnswers.push(vector);
                
            }
        }
        return correctAnswers;
    }

    static checkOnSize(answers:string[][] , trueAnswers:string[][])
    {
        if(answers.length != trueAnswers.length)
        {
            return false;
        }
        for(let i = 0; i < trueAnswers.length; i++)
        {
            if(trueAnswers[i].length != answers[i].length)
            {
                return false;
            }
        }
        return true;
    }

     

    




    


}