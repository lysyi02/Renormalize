import { findPossibleEmails } from "./findPossibleEmails";
import { classifyDataset } from "./classifyDataset";
import { config } from "./config";

classifyDataset();

const threshold = config.similarityThreshold;

findPossibleEmails(threshold);
