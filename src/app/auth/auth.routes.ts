import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { roleBasedProtection } from "../middleware/roleBasedProtection";
import { Role } from "../modules/user/user.interface";
import passport from "passport";

export const authRoutes = Router();

authRoutes.post("/login", authController.userLogin);

authRoutes.post("/refresh-token", authController.getNewAccessToken);

authRoutes.post("/logout", authController.userLogOut);

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

/*

  on /forget-password route user will give just email
  -> send a email 
  -> in that body sent a redirect to frontend url with id and token params (http://localhost:5173/reset-password?id=6891ef7821db032ad13110ba&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkxZWY3ODIxZGIwMzJhZDEzMTEwYmEiLCJlbWFpbCI6ImtoaG5pbG95MEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NDM5NDg3MywiZXhwIjoxNzU0Mzk1NDczfQ.imgSGumeRbwPPFpzrQovfXzE-bzOUmF9c_WmQWVjISQ) 

  then from frontend will hit /reset-password with id and new pass in body, then just update pass

*/


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
