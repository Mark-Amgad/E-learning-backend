import {classifySentence, getSentence} from "../controllers/sentenceGeneratorController";
import express from "express";
const textToSpeechRouter = express.Router();

export default textToSpeechRouter;


textToSpeechRouter.get("/level/:sentence",classifySentence);
textToSpeechRouter.get("/",getSentence);
