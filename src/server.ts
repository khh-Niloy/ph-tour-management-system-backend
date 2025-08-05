/* eslint-disable no-console */
import { envVars } from "./app/config/env";
import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis, redisClient } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log("✅ mongoose connected");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running`);
    });
  } catch (error) {
    console.log("error on startServer", error);
  }
};

(async () => {
  await connectRedis()
  await startServer();
  await seedSuperAdmin();
})();

const graceFullyShutDown = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
};

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);
  graceFullyShutDown();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");
  graceFullyShutDown();
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);
  graceFullyShutDown();
});

/**
 * unhandled rejection error -> promise
 * uncaught rejection error
 * signal termination -> sigterm
 */
