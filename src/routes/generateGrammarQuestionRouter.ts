import { generateGrammarQuestion, generateGrammarQuestionDemo } from "../controllers/generateGrammarQuestion";
import express from "express";
const generateGrammarQuestionRouter = express.Router();

export default generateGrammarQuestionRouter;


generateGrammarQuestionRouter.get("/:level", generateGrammarQuestion);
generateGrammarQuestionRouter.post("/", generateGrammarQuestionDemo);
