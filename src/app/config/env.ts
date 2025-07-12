import dotenv from "dotenv";
dotenv.config();

interface IEnvVars {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVars = (): IEnvVars => {
  const requiredEnvVar: string[] = ["PORT", "MONGO_URI", "NODE_ENV"];
  requiredEnvVar.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`env not found error -> ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.MONGO_URI as "development" | "production",
  };
};

export const envVars = loadEnvVars();
