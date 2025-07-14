import { Router } from "express";
import { userController } from "./user.controller";
import { userCreateZodSchema } from "./user.validation";
import { validateSchema } from "../../middleware/zodValidate";
import { Role } from "./user.interface";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const userRoutes = Router();

userRoutes.post(
  "/register",
  validateSchema(userCreateZodSchema),
  userController.createUser
);

userRoutes.get(
  "/all-user",
  roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUser
);
