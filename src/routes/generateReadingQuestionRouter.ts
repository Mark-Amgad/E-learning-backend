import { generateReadingQuestion } from "../controllers/generateReadingQuestion";
import express from "express";
const generateReadingQuestionRouter = express.Router();

export default generateReadingQuestionRouter;


generateReadingQuestionRouter.get("/:level", generateReadingQuestion);
