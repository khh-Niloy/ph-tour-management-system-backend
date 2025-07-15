import { Request, Response } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../utils/successResponse";

const userLogin = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const loggedInUser = await authService.userLoginService(req.body);
    // console.log(loggedInUser);

    res.cookie("refreshToken", loggedInUser.refreshToken, {
      httpOnly: true,
      secure: false,
    });

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

export const authController = {
  userLogin,
  getNewAccessToken,
};
