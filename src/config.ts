import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  sampleDataPath: process.env.SAMPLE_DATA_PATH!,
  usersDataPath: process.env.USERS_DATA_PATH!,
  classifiedOutputPath: process.env.CLASSIFIED_PATH!,
  finalOutputPath: process.env.FINAL_OUTPUT_PATH!,
  similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || "0"),
};
