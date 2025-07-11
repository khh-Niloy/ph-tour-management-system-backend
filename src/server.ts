import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khhniloy0:xWHroCdA4S4fsrqg@cluster0.m65dh.mongodb.net/ph-tour?appName=Cluster0"
    );
    console.log("✅ mongoose connected");

    server = app.listen(8000, () => {
      console.log(`Server is running`);
    });
  } catch (error) {
    console.log("error on startServer", error);
  }
};

startServer();

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
