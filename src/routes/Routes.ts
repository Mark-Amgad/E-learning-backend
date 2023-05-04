import questionsRouter from "./QuestionRouter";
import AuthRouter from "./Autherntication";
import textToSpeechRouter from "./TextToSpeechRouter";
import express from "express";
import checkForErrorsRouter from "./checkGrammer";
import userRouter from "./UserRouter";
import testRouter from "./testRouter";
import sentenceGeneratorRouter from "./sentenceGeneratorRouter";
import generateReadingQuestion from "./QuestionRouter";

const Router = express.Router();
export default Router;

Router.use("/questions", questionsRouter);
Router.use("/audio", textToSpeechRouter);
Router.use("/checkErrors", checkForErrorsRouter);
Router.use("/auth", AuthRouter);
Router.use("/users", userRouter);
Router.use("/tests/", testRouter);
Router.use("/sentence", sentenceGeneratorRouter);
Router.use("/generateReadingQuestion", generateReadingQuestion);


