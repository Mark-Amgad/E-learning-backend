import express from "express";
import QuestionController from "../controllers/QuestionController";
export const  speech2textRouter = express.Router();

const questionController = new QuestionController();

speech2textRouter.get('/', questionController.getSentence.bind(questionController))
speech2textRouter.post('/', questionController.evaluateSpeech.bind(questionController))
