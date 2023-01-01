import McqCompleteQuestionModel from "../models/McqComQuestion";
import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";

import { McqCompleteQuestion } from "../models/McqComQuestion";
import { ListeningReadingQuestion } from "../models/ListeningReadingQuestion";

import express from "express";



export default class QuestionController
{
    async getAllQuestions(req:express.Request,res:express.Response){
        try
        {
            let res1:McqCompleteQuestion[] = await McqCompleteQuestionModel.find();
            let res2:ListeningReadingQuestion[] = await ListeningReadingQuestionModel.find();
            const result:(McqCompleteQuestion|ListeningReadingQuestion)[] = [...res1,...res2];
            res.json({"questions":result});
        }
        catch(err)
        {
            res.send("error - questions - all");
        }
    }
    
    async getAllQuestionsType(req:express.Request,res:express.Response){
        try
        {
            let category:string = req.params.category;
            category = category.charAt(0).toUpperCase() + category.slice(1);
            if(category === "Grammar" || category === "Vocabulary")
            {
                const result:McqCompleteQuestion[] = await McqCompleteQuestionModel.find({category:category});
                res.json({"questions":result});
            }
            else if(category === "Listening" || category === "Reading")
            {
                const result:ListeningReadingQuestion[] = await ListeningReadingQuestionModel.find({category:category});
                res.json({"questions":result});
            }
            else
            {
                res.send("wrong category")
            }
        }
        catch(err)
        {
            // error handling
            res.send("error");
        }
    }

    async getQuestionsChunk(req:express.Request,res:express.Response)
    {
        try
        {
            let quantity = Number(req.params.quantity);
            let margin = Number(req.params.margin);
            let category = String(req.params.category);
            category = category.charAt(0).toUpperCase() + category.slice(1);
            if(category === "Grammar" || category === "Vocabulary")
            {
                const result:McqCompleteQuestion[] = await McqCompleteQuestionModel.find({category:category}).limit(quantity).skip(margin);
                res.json({"questions":result});
            }
            else if(category === "Listening" || category === "Reading")
            {
                const result:ListeningReadingQuestion[] = await ListeningReadingQuestionModel.find({category:category}).limit(quantity).skip(margin);
                res.json({"questions":result});
            }
            else
            {
                res.send("wrong category")
            }
        }
        catch(err)
        {
            // hnadling errors
            res.send("error");
        }
    }

    async deleteQuestion(req:express.Request,res:express.Response):Promise<void>
    {
        try
        {
            const questionId = Number(req.params.id);
            const questionType = req.params.category;
            if(questionType == "vocabulary" || questionType == "grammar")
            {
                const result = await McqCompleteQuestionModel.deleteOne({
                    "_id":questionId,
                    "type" : questionType
                });

                res.json({"message" : "Question deleted","code":true});
            }
            else if(questionType == "listening" || questionType == "reading")
            {
                const result = await ListeningReadingQuestionModel.deleteOne({
                    "_id":questionId,
                    "type" : questionType
                });

                res.json({"message" : "Question deleted","code":true});
            }
            else
            {
                res.send("wrong type");
            }
        }
        catch(err)
        {
            res.send("error ");
        }
    }
}
