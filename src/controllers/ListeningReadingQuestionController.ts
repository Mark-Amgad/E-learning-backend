import ListeningReadingQuestionModel from "../models/ListeningReadingQuestion";
import express from "express";

const ListeningReadingQuestionController = (app:express.Application)=>{
    app.get("/lr/",getAllListeningReadingQuestions);
}

export default ListeningReadingQuestionController;
const getAllListeningReadingQuestions = async (req:express.Request,res:express.Response)=>{
    try
    {
        const result = await ListeningReadingQuestionModel.find();
        res.json({"questions":result});
    }
    catch(err)
    {
        res.send("error");
    }
};

