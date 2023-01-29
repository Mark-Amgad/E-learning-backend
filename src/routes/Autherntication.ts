import express from "express";
import Authentication from "../controllers/Authentication_and_Authorization";

const AuthRouter = express.Router();
export default AuthRouter;

const AuthenticationController = new Authentication();

AuthRouter.post("/signup",AuthenticationController.signUp);
AuthRouter.post("/login",AuthenticationController.login);

