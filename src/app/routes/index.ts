import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../auth/auth.routes";

export const routes = Router();

const allRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

allRoutes.forEach(({ path, route }) => routes.use(path, route));
