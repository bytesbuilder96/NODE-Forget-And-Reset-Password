import { Router } from "express";
import {
  createUser,
  loginUser,
  forgetPassword,
} from "../conftroller/user.controller.js";

const userRouter = Router();

userRouter.post("/create", createUser);
userRouter.get("/login", loginUser);
userRouter.post("/forget", forgetPassword);

export { userRouter };
