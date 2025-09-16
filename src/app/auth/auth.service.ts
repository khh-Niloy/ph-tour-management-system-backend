import bcryptjs from "bcryptjs";
import { IauthProvider, isActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import {
  createAccessAndRefreshToken,
  getNewAccessTokenFromRefreshToken,
} from "../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../utils/sendEmail";

const userLoginService = async (playLoad: Partial<IUser>) => {
  const { email, password } = playLoad;

  const user = await User.findOne({ email });
  // console.log(user);

  if (!user) {
    throw new Error("Please register first");
  }

  if (
      user?.isActive === isActive.BLOCKED ||
      user?.isActive === isActive.INACTIVE
    ) {
      throw new Error(`user is ${user?.isActive}!`);
    }

    if (user?.isDeleted) {
      throw new Error("user is deleted!");
    }

    if (!user?.isVerified) {
      throw new Error("user is not verified!");
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

  const { accessToken, refreshToken } = createAccessAndRefreshToken(jwtPayload);

  return { accessToken, refreshToken, user: user };
};

const getNewAccessTokenService = async (refreshToken: string) => {
  const newAccessstoken = getNewAccessTokenFromRefreshToken(refreshToken);
  return newAccessstoken;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  payload: JwtPayload
) => {
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new Error("user not exist");
  }

  const isPasswordOK = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );

  if (!isPasswordOK) {
    throw new Error("old password did not match!");
  }

  const newHashedPassword = await bcryptjs.hash(
    newPassword,
    parseInt(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = newHashedPassword;
  user.save();
};

const setPassword = async (password: string, userInfo: JwtPayload) => {
  const user = await User.findById(userInfo.userId);

  if (!user) {
    throw new Error("user not exist");
  }

  if(user.password && user.auths.some(prodiver => prodiver.provider === "google")){
    throw new Error("You have already set you password. Now you can change the password from your profile password update");
    
  }

  const newHashedPassword = await bcryptjs.hash(password, envVars.BCRYPT_SALT_ROUND);

  const credentialProvider : IauthProvider = {
    provider: "credential", providerId: user.email
  }

  const auths :  IauthProvider[] = [...user.auths, credentialProvider]
  user.auths = auths
  user.password = newHashedPassword;
  await user.save();
};

const forgetPasswordService = async (email: string) => {
  const existUser = await User.findOne({email: email});

  if (!existUser) {
    throw new Error("user does not exist");
  }

  if (
    existUser?.isActive === isActive.BLOCKED ||
    existUser?.isActive === isActive.INACTIVE
  ) {
    throw new Error(`user is ${existUser?.isActive}!`);
  }
        
  if(existUser?.isDeleted) {
    throw new Error("user is deleted!");
  }

  // ! have to add is verified check

  const jwtPayload = {
    userId: existUser._id,
    email: existUser.email,
    role: existUser.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m"
  })

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${existUser._id}&token=${resetToken}`

  sendEmail({
    to: existUser?.email,
    subject: "Password Reset",
    templateName: "forgetPass",
    templateData: {
      name: existUser?.name,
      resetUILink
    }
  })

};

const resetPasswordService = async (id: string, password: string, userInfo: JwtPayload) => {

  if(id === userInfo.userId){
    throw new Error("user id does not match");
  }

  const user = await User.findById(id)

  if(!user){
    throw new Error("user does not match");
  }

  const newUpdatedHashedPassword = await bcryptjs.hash(
    password,
    parseInt(envVars.BCRYPT_SALT_ROUND)
  );
  user.password = newUpdatedHashedPassword
  await user.save()
};

export const authService = {
  userLoginService,
  getNewAccessTokenService,
  changePassword,
  setPassword,
  forgetPasswordService,
  resetPasswordService
};
