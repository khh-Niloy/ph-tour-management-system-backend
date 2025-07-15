import { Request, Response } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../utils/successResponse";
import { setCookie } from "../utils/setCookie";

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

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const payload = req.user;

    await authService.resetPasswordService(oldPassword, newPassword, payload);

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

export const authController = {
  userLogin,
  getNewAccessToken,
  userLogOut,
  resetPassword,
};
