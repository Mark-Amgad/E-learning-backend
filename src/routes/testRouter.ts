import express from "express";
import { TestController } from "../controllers/TestController";

const testRouter = express.Router();

export default testRouter;

const testController = new TestController();

testRouter.get("/create/:email/:category/:level/:size",testController.createTest);
testRouter.get("/:email",testController.getTests);
testRouter.post("/submit",testController.submitTest);
testRouter.get("/get/:test_id",testController.getTest);
testRouter.get("/placement/all",testController.getPlacementTest);