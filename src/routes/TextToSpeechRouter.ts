import {GetAudio} from "../controllers/textToSpeechController";
import express from "express";
const textToSpeechRouter = express.Router();

export default textToSpeechRouter;


textToSpeechRouter.get("/:text",GetAudio);