import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCreatedUser = await userServices.createUserService(req.body);
    res.status(201).json({
      message: "User created",
      newUser: newCreatedUser,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const userController = {
  createUser,
};
