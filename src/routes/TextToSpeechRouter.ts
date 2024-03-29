import {GetAudio, audio, findAudio} from "../controllers/textToSpeechController";
import express from "express";
const textToSpeechRouter = express.Router();

export default textToSpeechRouter;


textToSpeechRouter.get("/audio/getAudio",audio);
textToSpeechRouter.get("/audio/:path",findAudio);
textToSpeechRouter.get("/:level",GetAudio);
