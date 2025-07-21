import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../auth/auth.routes";
import { divisionRoutes } from "../modules/division/division.routes";
import { tourRoutes } from "../modules/tour/tour.routes";

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
  {
    path: "/division",
    route: divisionRoutes,
  },
  {
    path: "/tour",
    route: tourRoutes,
  },
];

allRoutes.forEach(({ path, route }) => routes.use(path, route));
