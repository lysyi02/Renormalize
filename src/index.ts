import { findPossibleEmails } from "./findPossibleEmails";
import { classifyDataset } from "./classifyDataset";
import { config } from "./config";

// Not needed for task solving if you know suitable threshold value, only to visualise data.
classifyDataset();

const threshold = config.similarityThreshold;

findPossibleEmails(threshold);
