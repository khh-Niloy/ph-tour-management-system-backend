import { Router } from "express";
import { userController } from "./user.controller";
import { userCreateZodSchema } from "./user.validation";
import { validateSchema } from "../../middleware/zodValidate";
import { Role } from "./user.interface";
import { roleBasedProtection } from "../../middleware/roleBasedProtection";

export const userRoutes = Router();

userRoutes.get(
  "/all-user",
  roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUser
);

userRoutes.get(
  "/all-user",
  roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUser
);

userRoutes.get("/me", roleBasedProtection(...Object.values(Role)), userController.getMe)

userRoutes.post(
  "/register",
  validateSchema(userCreateZodSchema),
  userController.createUser
);

userRoutes.patch(
  "/:id",
  roleBasedProtection(Role.ADMIN, Role.SUPER_ADMIN, Role.USER),
  userController.updateUser
);
