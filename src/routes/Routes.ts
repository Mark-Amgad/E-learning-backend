import questionsRouter from "./QuestionRouter";
import AuthRouter from "./Autherntication";
import textToSpeechRouter from "./TextToSpeechRouter";
import express from "express";
import checkForErrorsRouter from "./checkGrammer";
import userRouter from "./UserRouter";
import testRouter from "./testRouter";
import sentenceGeneratorRouter from "./sentenceGeneratorRouter";
import generateReadingQuestionRouter from "./generateReadingQuestionRouter";
import generateVocabQuestionRouter from "./generateVocabQuestionRouter";
import generateGrammarQuestionRouter from "./generateGrammarQuestionRouter";
import generateDistractorsRouter from "./generateDistractorsRouter";

const Router = express.Router();
export default Router;

Router.use("/questions", questionsRouter);
Router.use("/checkErrors", checkForErrorsRouter);
Router.use("/auth", AuthRouter);
Router.use("/users", userRouter);
Router.use("/tests/", testRouter);
Router.use("/sentence", sentenceGeneratorRouter);
Router.use("/generateReadingQuestion", generateReadingQuestionRouter);
Router.use("/generateVocabQuestion", generateVocabQuestionRouter);
Router.use("/generateGrammarQuestion", generateGrammarQuestionRouter);
Router.use("/generateListeningQuestion", textToSpeechRouter);
Router.use("/generateDistractors", generateDistractorsRouter);


