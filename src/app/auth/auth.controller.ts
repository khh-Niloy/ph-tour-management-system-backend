import { setCookie } from "./../utils/setCookie";
import { Request, Response } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../utils/successResponse";
import { createAccessAndRefreshToken } from "../utils/userToken";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../modules/user/user.interface";

const userLogin = async (req: Request, res: Response) => {
  try {
    const loggedInUser = await authService.userLoginService(req.body);

    setCookie(res, loggedInUser.accessToken, loggedInUser.refreshToken);

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "log in successful",
      data: loggedInUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = await authService.getNewAccessTokenService(
      refreshToken as string
    );
    setCookie(res, newAccessToken.newAccessToken);

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "new accees token created",
      data: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const userLogOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "user log out",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const payload = req.user;

    await authService.changePassword(
      oldPassword,
      newPassword,
      payload as JwtPayload
    );

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "password updated",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const setPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const userInfo = req.user;

    await authService.setPassword(password, userInfo as JwtPayload);

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "password updated",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgetPasswordService(email);
    // res.redirect(`${envVars.FRONTEND_URL}?email=${email}&token=${token}`)

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "email sent",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const {id, password} = req.body
    const userInfo = req.user
    await authService.resetPasswordService(id, password, userInfo as JwtPayload);

    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "password reset and updated",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: (error as Error).message,
    });
  }
};




// ++++++++++++++++++++++++++++++ google ++++++++++++++++++++++++++++++

export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user;
  const redirectTo = (req.query.state ? req.query.state : "") as string;

  if (redirectTo.startsWith("/")) {
    redirectTo.slice(1);
  }

  const { _id, email, role } = user as Partial<IUser>;

  if (!user) {
    throw new Error("user not found");
  }

  const userPayload = {
    userId: _id,
    email: email,
    role: role,
  };

  const { accessToken, refreshToken } =
    createAccessAndRefreshToken(userPayload);
  // console.log(accessToken, refreshToken);
  setCookie(res, accessToken, refreshToken);

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
};

export const authController = {
  userLogin,
  getNewAccessToken,
  userLogOut,
  changePassword,
  googleCallback,
  setPassword,
  forgetPassword,
  resetPassword
};
