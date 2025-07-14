import { Router } from "express";
import { userController } from "./user.controller";
import { userCreateZodSchema } from "./user.validation";
import { validateSchema } from "../../middleware/zodValidate";

export const userRoutes = Router();

userRoutes.post(
  "/register",
  validateSchema(userCreateZodSchema),
  userController.createUser
);

userRoutes.get("/all-user", userController.getAllUser);
