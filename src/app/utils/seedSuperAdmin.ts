import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IauthProvider, IUser, Role } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
  const user = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

  if (user) {
    return;
  }

  const hashedPassword = await bcryptjs.hash(
    envVars.SUPER_ADMIN_PASSWORD as string,
    parseInt(envVars.BCRYPT_SALT_ROUND)
  );

  const authsProvider: IauthProvider = {
    provider: "credential",
    providerId: envVars.SUPER_ADMIN_EMAIL,
  };

  const playLoad: Partial<IUser> = {
    name: "niloy admin",
    email: envVars.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    auths: [authsProvider],
    role: Role.SUPER_ADMIN,
  };

  await User.create(playLoad);
};
