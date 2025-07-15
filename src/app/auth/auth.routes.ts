import { Router } from "express";
import { authController } from "./auth.controller";
import { roleBasedProtection } from "../middleware/roleBasedProtection";
import { Role } from "../modules/user/user.interface";

export const authRoutes = Router();

authRoutes.post("/login", authController.userLogin);
authRoutes.post("/refresh-token", authController.getNewAccessToken);
authRoutes.get("/logout", authController.userLogOut);
authRoutes.post(
  "/reset-password",
  roleBasedProtection(...Object.values(Role)),
  authController.resetPassword
);
