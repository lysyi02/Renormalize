import fs from "fs";
import { stringSimilarity } from "string-similarity-js";
import dotenv from "dotenv";

dotenv.config();

const SAMPLE_DATA_PATH = process.env.SAMPLE_DATA_PATH || "sample_data.json";
const USERS_DATA_PATH = process.env.USERS_DATA_PATH || "users.json";
const SORTED_OUTPUT_PATH =
  process.env.SORTED_OUTPUT_PATH || "sorted-by-similarity.json";
const FINAL_OUTPUT_PATH = process.env.FINAL_OUTPUT_PATH || "output.json";
const SIMILARITY_THRESHOLD = parseFloat(
  process.env.SIMILARITY_THRESHOLD || "0.5",
);

function readJsonFromFile(filename: fs.PathOrFileDescriptor) {
  try {
    const jsonString = fs.readFileSync(filename, "utf8");
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

function prepareEmail(email: string) {
  const preparedEmail = email.split("@")[0].replace(/\d+/g, "");
  return preparedEmail;
}

interface SimilarityResult {
  mostSimilarEmail: string;
  similarity: number;
}

function findMostSimilarKnownEmail(
  uncategorized_email: string,
  known_emails: Iterable<string>,
  threshold: number,
): SimilarityResult {
  return Array.from(known_emails).reduce<SimilarityResult>(
    (accumulator, known_email) => {
      const similarity_rate = stringSimilarity(
        prepareEmail(known_email),
        prepareEmail(uncategorized_email),
      );

      if (
        similarity_rate >= threshold &&
        similarity_rate > accumulator.similarity
      ) {
        return { mostSimilarEmail: known_email, similarity: similarity_rate };
      } else {
        return accumulator;
      }
    },
    { mostSimilarEmail: "", similarity: 0 },
  );
}

const uncategorizedEmails = new Set<string>();
const data = readJsonFromFile(SAMPLE_DATA_PATH);
for (const record of data) {
  if (record.email) uncategorizedEmails.add(record.email);
  if (record.account_email) uncategorizedEmails.add(record.account_email);
}

const knownEmails = new Set<string>();
const users = readJsonFromFile(USERS_DATA_PATH);
for (const user of users) {
  knownEmails.add(user.email);
}

const sortedBySimilarity = [];
for (const uncategorizedEmail of uncategorizedEmails) {
  sortedBySimilarity.push({
    email: uncategorizedEmail,
    ...findMostSimilarKnownEmail(uncategorizedEmail, knownEmails, 0),
  });
}
sortedBySimilarity.sort((a, b) => a.similarity - b.similarity);
fs.writeFileSync(
  SORTED_OUTPUT_PATH,
  JSON.stringify(sortedBySimilarity, null, 2),
  "utf8",
);
console.log(
  `The algorithm may identify weak similarities (typically with a similarity rate of 0 to 0.3) between unrelated emails.
Related emails generally have a higher similarity rate (0.5+).
Inspect '${SORTED_OUTPUT_PATH}' to determine the appropriate similarity threshold.
Results with a similarity below the threshold will be classified as 'not_recognized'.\n`,
);

const threshold = SIMILARITY_THRESHOLD;
const notRecognized = [];
const recognizedMap = new Map<string, string[]>(
  Array.from(knownEmails, (email) => [email, []]),
);
for (const uncategorizedEmail of uncategorizedEmails) {
  const { mostSimilarEmail } = findMostSimilarKnownEmail(
    uncategorizedEmail,
    knownEmails,
    threshold,
  );
  if (mostSimilarEmail) {
    recognizedMap.get(mostSimilarEmail)!.push(uncategorizedEmail);
  } else notRecognized.push(uncategorizedEmail);
}

const recognized = Array.from(recognizedMap.entries()).map(
  ([user_email, related_emails]) => ({
    user_email,
    related_emails,
  }),
);

const output = {
  recognized,
  not_recognized: notRecognized,
};

fs.writeFileSync(FINAL_OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
console.log(
  `Dataset classifyed with threshold=${threshold} was saved into '${FINAL_OUTPUT_PATH}'`,
);
