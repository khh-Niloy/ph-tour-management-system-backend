import { envVars } from "../../config/env";
import { IauthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

const createUserService = async (playLoad: Partial<IUser>) => {
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

const getAllUserService = async () => {
  const allUser = await User.find({});
  const totalCount = await User.countDocuments();
  return { allUser, totalCount };
};

export const userServices = {
  createUserService,
  getAllUserService,
};
