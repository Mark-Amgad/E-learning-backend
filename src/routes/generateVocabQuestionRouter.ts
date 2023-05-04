import { generateVocabQuestion } from "../controllers/generateVocabQuestion";
import express from "express";
const generateVocabQuestionRouter = express.Router();

export default generateVocabQuestionRouter;


generateVocabQuestionRouter.get("/:level", generateVocabQuestion);
