/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // console.log(err)

  // console.log({ file: req.files });

  if(req.file){
    await deleteImageFromCloudinary(req?.file.path)
  }

  if(req.files && Array.isArray(req.files) && req.files.length){
    const urls = req.files?.map(file => file.path)
    await Promise.all(urls.map(url => deleteImageFromCloudinary(url)))
  }


  res.status(500).json({
    success: false,
    message: `something went wrong : ${err.message}`,
    err,
    stack: envVars.NODE_ENV == "development" ? err.stack : null,
  });
};
