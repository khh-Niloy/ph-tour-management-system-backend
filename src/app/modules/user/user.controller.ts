import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { successResponse } from "../../utils/successResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.body)
    const newCreatedUser = await userServices.createUserService(req.body);
    successResponse(res, {
      statusCode: 201,
      success: true,
      message: "user created",
      data: newCreatedUser,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const payload = req.user;
    const reqBody = req.body;
    const updatedUserInfo = await userServices.updateUserService(
      userId,
      payload as JwtPayload,
      reqBody
    );

    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "user info updated",
      data: updatedUserInfo,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const { allUser, totalCount } = await userServices.getAllUserService();
    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "all user retreived",
      meta: totalCount,
      data: allUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const userInfo = req.user
    const me = await userServices.getMeService(userInfo as JwtPayload);
    successResponse(res, {
      statusCode: 200,
      success: true,
      message: "my info",
      data: me,
    });
  } catch (error) {
    console.log(error);
  }
};

export const userController = {
  createUser,
  getAllUser,
  updateUser,
  getMe
};
