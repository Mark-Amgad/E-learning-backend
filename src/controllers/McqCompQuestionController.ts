import McqCompleteQuestionModel from "../models/McqComQuestion";
import express from "express";
import {McqCompleteQuestion} from "../models/McqComQuestion";

const McqCompQuestionController = (app:express.Application)=>{
    app.get("/mcq/",getAllMcqCompQuestions);
};
export default McqCompQuestionController;



const getAllMcqCompQuestions = async(req:express.Request,res:express.Response)=>{
    try
    {
        const result = await McqCompleteQuestionModel.find();
        res.json({"questions":result});
    }
    catch(err)
    {
        res.send("error");
    }
}

const createMcqCompQuestion = async(req:express.Request,res:express.Response)=>{
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