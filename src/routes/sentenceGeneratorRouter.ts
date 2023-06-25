import {classifySentence, getSentence} from "../controllers/sentenceGeneratorController";
import express from "express";
const textToSpeechRouter = express.Router();

export default textToSpeechRouter;


textToSpeechRouter.post("/level",classifySentence);
textToSpeechRouter.get("/",getSentence);
