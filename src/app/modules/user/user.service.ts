import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IauthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

const createUserService = async (playLoad: Partial<IUser>) => {
  console.log("first")
  const { email, password, ...rest } = playLoad;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new Error("User already exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    parseInt(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IauthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const newCreatedUser = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return newCreatedUser;
};

const updateUserService = async (
  userId: string,
  payload: JwtPayload,
  reqBody: Partial<IUser>
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("user not found!");
  }

  if (
    (payload?.role == Role.ADMIN || payload?.role == Role.USER) &&
    reqBody?.role == Role.SUPER_ADMIN
  ) {
    throw new Error("you are not authorized to make role super admin");
  }

  if (payload?.role == Role.USER && reqBody?.role == Role.ADMIN) {
    throw new Error("you are not authorized to make role admin");
  }

  if (
    (reqBody?.isActive || reqBody?.isDeleted || reqBody?.isVerified) &&
    payload?.role === Role.USER
  ) {
    throw new Error(
      "you are not authorized to make changes to isActive, isDeleted and isVerified as user"
    );
  }

  if(reqBody.password){
  const newUpdateHashedPassword = await bcryptjs.hash(
    reqBody?.password as string,
    parseInt(envVars.BCRYPT_SALT_ROUND)
  );
    reqBody.password = newUpdateHashedPassword;
  }

  const updateUser = await User.findByIdAndUpdate(userId, reqBody, {
    new: true,
  });
  return updateUser;
};

const getAllUserService = async () => {
  const allUser = await User.find({});
  const totalCount = await User.countDocuments();
  return { allUser, totalCount };
};

export const userServices = {
  createUserService,
  getAllUserService,
  updateUserService,
};
