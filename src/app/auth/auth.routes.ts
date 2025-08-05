import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { roleBasedProtection } from "../middleware/roleBasedProtection";
import { Role } from "../modules/user/user.interface";
import passport from "passport";

export const authRoutes = Router();

authRoutes.post("/login", authController.userLogin);

authRoutes.post("/refresh-token", authController.getNewAccessToken);

authRoutes.get("/logout", authController.userLogOut);

authRoutes.post("/change-password",
  roleBasedProtection(...Object.values(Role)),
  authController.changePassword
);

authRoutes.post("/set-password",
  roleBasedProtection(...Object.values(Role)),
  authController.setPassword
);

authRoutes.post("/forget-password", authController.forgetPassword)

authRoutes.post("/reset-password", roleBasedProtection(...Object.values(Role)),  authController.resetPassword)

// google login -> callback
authRoutes.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || ("/" as string);

    passport.authenticate("google", {
      scope: ["email", "profile"],
      state: redirect as string,
    })(req, res, next);
  }
);

// callback
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);
