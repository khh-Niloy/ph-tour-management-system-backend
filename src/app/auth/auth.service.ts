import bcryptjs from "bcryptjs";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import jwt from "jsonwebtoken";

const userLoginService = async (playLoad: Partial<IUser>) => {
  const { email, password } = playLoad;

  const user = await User.findOne({ email });
  console.log(user);

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

  const accessToken = jwt.sign(jwtPayload, "secret", {
    expiresIn: "1D",
  });

  return { accessToken, user };
};

export const authService = {
  userLoginService,
};
