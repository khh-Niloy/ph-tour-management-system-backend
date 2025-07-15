import { Response } from "express";

export const setCookie = (
  res: Response,
  accessToken?: string,
  refreshToken?: string
) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
