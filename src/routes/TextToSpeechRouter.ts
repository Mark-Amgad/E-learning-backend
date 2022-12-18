import {GetAudio,GetText} from "../controllers/textToSpeechController";
import express from "express";
const textToSpeechRouter = express.Router();

export default textToSpeechRouter;


textToSpeechRouter.get("/",GetAudio);
textToSpeechRouter.get("/text",GetText);