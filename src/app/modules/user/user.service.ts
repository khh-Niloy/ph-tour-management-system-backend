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

export const userServices = {
  createUserService,
};
