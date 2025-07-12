import dotenv from "dotenv";
dotenv.config();

interface IEnvVars {
  PORT: string;
  MONGO_URI: string;
}

const loadEnvVars = (): IEnvVars => {
  const requiredEnvVar: string[] = ["PORT", "MONGO_URI"];
  requiredEnvVar.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`env not found error -> ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
  };
};

export const envVars = loadEnvVars();
