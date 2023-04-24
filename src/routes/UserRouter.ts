import express from "express";
import UserController from "../controllers/UserController";
const userRouter = express.Router();

export default userRouter;

const userController = new UserController();


userRouter.get("/",userController.getAllUsers);
userRouter.delete("/:email",userController.deleteUser);
userRouter.get("/:email",userController.getUser);
userRouter.put("/update",userController.updateUser);
