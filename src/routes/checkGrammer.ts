import { checkForErrors } from "../controllers/checkGrammer";
import express from "express";
const checkForErrorsRouter = express.Router();

export default checkForErrorsRouter;


checkForErrorsRouter.get("/", checkForErrors);