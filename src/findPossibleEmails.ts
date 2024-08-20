import { config } from "./config";
import {
  prepareKnownEmails,
  prepareUncategorizedEmails,
} from "./dataPreparation";
import { findMostSimilarKnownEmail } from "./emailSimilarity";
import { writeJsonToFile } from "./fileUtils";

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
