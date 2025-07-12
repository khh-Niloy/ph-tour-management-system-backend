import express, { Request, Response } from "express";
import { routes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
export const app = express();

app.use(express.json());
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to ph tour management system backend",
  });
});

// *global error
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);

/*
 * app.ts -> routes (index.ts) -> module routes (user) -> controller -> services -> model -> db
 */
