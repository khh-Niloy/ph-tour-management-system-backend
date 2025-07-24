import express, { Request, Response } from "express";
import { routes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
export const app = express();
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
console.log("test")
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to ph tour management system backend",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);

app.use(notFound);

/*
 * app.ts -> routes (index.ts) -> module routes (user) -> controller -> services -> model -> db
 */
