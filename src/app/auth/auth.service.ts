import bcryptjs from "bcryptjs";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

const userLoginService = async (playLoad: Partial<IUser>) => {
  const { email, password } = playLoad;

  const user = await User.findOne({ email });
  // console.log(user);

  if (!user) {
    throw new Error("Please register first");
  }
  const checkPassword = await bcryptjs.compare(
    password as string,
    user.password as string
  );

  if (!checkPassword) {
    throw new Error("password did not match!");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return { accessToken, refreshToken, user: user };
};

const getNewAccessTokenService = async (refreshToken: string) => {
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
    envVars.JWT_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    newAccessToken: accessToken,
    user: user,
  };
};

export const authService = {
  userLoginService,
  getNewAccessTokenService,
};
