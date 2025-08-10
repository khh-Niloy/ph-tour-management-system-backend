import express, { Request, Response } from "express";
import { routes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";
import cors from "cors";

export const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({extended: true}))
app.set("trust proxy", 1);
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

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
