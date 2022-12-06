import questionsRouter from "./QuestionRouter";
import express from "express";

const Router = express.Router();
export default Router;

Router.use("/questions",questionsRouter);
