import { generateGrammarQuestion } from "../controllers/generateGrammarQuestion";
import express from "express";
const generateGrammarQuestionRouter = express.Router();

export default generateGrammarQuestionRouter;


generateGrammarQuestionRouter.get("/:level", generateGrammarQuestion);
