import { checkForErrors, getSupportedLanguages } from "../controllers/checkGrammer";
import express from "express";
const checkForErrorsRouter = express.Router();

export default checkForErrorsRouter;


checkForErrorsRouter.get("/", checkForErrors);
checkForErrorsRouter.get("/supportedLanguages", getSupportedLanguages);