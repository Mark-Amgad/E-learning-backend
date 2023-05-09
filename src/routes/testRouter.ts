import express from "express";
import { TestController } from "../controllers/TestController";

const testRouter = express.Router();

export default testRouter;

const testController = new TestController();

testRouter.get("/create",testController.createTest);
testRouter.get("/:email",testController.getTests);
testRouter.post("/submit",testController.submitTest);