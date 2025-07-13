import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import { successResponse } from "../../utils/successResponse";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

export const userController = {
  createUser,
  getAllUser,
};
