import questionsRouter from "./QuestionRouter";
import textToSpeechRouter from "./TextToSpeechRouter";
import express from "express";
import checkForErrorsRouter from "./checkGrammer";

const Router = express.Router();
export default Router;

Router.use("/questions", questionsRouter);
Router.use("/audio", textToSpeechRouter);
Router.use("/checkErrors", checkForErrorsRouter)

