import questionsRouter from "./QuestionRouter";
import textToSpeechRouter from "./TextToSpeechRouter";
import express from "express";

const Router = express.Router();
export default Router;

Router.use("/questions",questionsRouter);
Router.use("/audio",textToSpeechRouter);

