import { Request, Response } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../utils/successResponse";

const userLogin = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const loggedInUser = await authService.userLoginService(req.body);

    // console.log(loggedInUser);

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

export const authController = {
  userLogin,
};
