import { config } from "./config";
import {
  prepareKnownEmails,
  prepareUncategorizedEmails,
} from "./dataPreparation";
import { findMostSimilarKnownEmail } from "./emailSimilarity";
import { writeJsonToFile } from "./fileUtils";

/**
 * Finds and classifies emails based on their similarity to known emails.
 *
 * This function compares uncategorized emails to a list of known emails using a specified similarity threshold.
 * It categorizes the emails into recognized and not recognized groups and writes the results to a JSON file.
 *
 * @param {number} threshold - The similarity threshold used to determine if an email is recognized.
 *
 * The output is saved to a JSON file specified by `config.finalOutputPath`. The result includes:
 * - `recognized`: An array of objects where each object contains a user email and an array of related emails.
 * - `not_recognized`: An array of emails that did not match any known emails above the threshold.
 *
 * @example Output:
 * {
 *   "recognized": [
 *     {
 *       "user_email": "user@example.com",
 *       "related_emails": ["u2ser2@example.com", "user.3@example.com"]
 *     }
 *   ],
 *   "not_recognized": ["unknown@example.com", "another_unknown@example.com"]
 * }
 *
 */
export function findPossibleEmails(threshold: number) {
  const knownEmails = prepareKnownEmails(config.usersDataPath);
  const uncategorizedEmails = prepareUncategorizedEmails(config.sampleDataPath);

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

  writeJsonToFile(config.finalOutputPath, output);
  console.log(
    `Possible emails were found! Result saved into '${config.finalOutputPath}'`,
  );
}
