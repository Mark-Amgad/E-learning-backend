import { generateDistractors } from "../controllers/generateDistractors";
import express from "express";
const generateDistractorsRouter = express.Router();

export default generateDistractorsRouter;


generateDistractorsRouter.post("/", generateDistractors);
