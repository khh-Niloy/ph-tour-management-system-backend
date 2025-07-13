import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserService = async (playLoad: Partial<IUser>) => {
  const { name, email } = playLoad;
  const newCreatedUser = await User.create({
    name,
    email,
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
