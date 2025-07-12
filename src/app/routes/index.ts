import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";

export const routes = Router();

const allRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

allRoutes.forEach(({ path, route }) => routes.use(path, route));
