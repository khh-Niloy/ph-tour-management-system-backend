import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";

export const createAccessAndRefreshToken = (jwtPayload: JwtPayload) => {
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken };
};

export const getNewAccessTokenFromRefreshToken = async (
  refreshToken: string
) => {
  const userInfoFromRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  );

  if (!userInfoFromRefreshToken) {
    throw new Error("refresh token does not exist");
  }

  const user = await User.findById(
    (userInfoFromRefreshToken as JwtPayload).userId
  );

  if (!user) {
    throw new Error("user does not exist");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    newAccessToken: accessToken,
    user: user,
  };
};
