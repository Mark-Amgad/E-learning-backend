import express from "express";
import QuestionController from "../controllers/QuestionController";
import { SpeechController } from "../controllers/speech2text.controller";
export const  speech2textRouter = express.Router();

const speechController = new SpeechController();

speech2textRouter.get('/', speechController.getSentence.bind(speechController))
speech2textRouter.post('/', speechController.evaluateSpeech.bind(speechController))
