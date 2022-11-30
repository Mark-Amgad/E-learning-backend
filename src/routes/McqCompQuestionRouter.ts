import express from "express";
import McqComQuestions from "../controllers/McqCompQuestionController";

const router = express.Router();
const mcqComQuestions = new McqComQuestions();

router.route("/mcq").get(mcqComQuestions.getAllMcqCompQuestions);

export default router;
