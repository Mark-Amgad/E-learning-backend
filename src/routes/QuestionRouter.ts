/*
app.get("/questions/",getAllQuestions);
app.get("/questions/:category",getAllQuestionsType);
*/

import express from "express";
import QuestionController from "../controllers/QuestionController";
const questionsRouter = express.Router();

export default questionsRouter;

const questionController = new QuestionController();

questionsRouter.get("/",questionController.getAllQuestions);
questionsRouter.get("/:category",questionController.getAllQuestionsType);