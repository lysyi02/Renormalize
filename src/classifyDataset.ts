import { config } from "./config";
import {
  prepareKnownEmails,
  prepareUncategorizedEmails,
} from "./dataPreparation";
import { findMostSimilarKnownEmail } from "./emailSimilarity";
import { writeJsonToFile } from "./fileUtils";
/**
 * Sorts dataset by similarity to the most similar known email. Writes output into json file.
 *
 * @example Example output in the result file (`outputPath`):
 * [
 *   {
 *     "email": "qqsxerqnvr@example.com",
 *     "mostSimilarEmail": "jim.halpert@dundermifflin.com",
 *     "similarity": 0.10526315789473684
 *   },
 *   {
 *     "email": "beswvhexl@yahoo.com",
 *     "mostSimilarEmail": "pam.beesly@dundermifflin.com",
 *     "similarity": 0.23529411764705882
 *   },
 *   {
 *     "email": "rayan.6000netfgov121@outlook.com",
 *     "mostSimilarEmail": "rayan.gov121@dundermifflin.com",
 *     "similarity": 0.7
 *   }
 * ]
 */
export function classifyDataset(): void {
  const knownEmails = prepareKnownEmails(config.usersDataPath);
  const uncategorizedEmails = prepareUncategorizedEmails(config.sampleDataPath);

  const sortedBySimilarity = [];
  const THRESHOLD = 0;
  for (const uncategorizedEmail of uncategorizedEmails) {
    sortedBySimilarity.push({
      email: uncategorizedEmail,
      ...findMostSimilarKnownEmail(uncategorizedEmail, knownEmails, THRESHOLD),
    });
  }
  sortedBySimilarity.sort((a, b) => a.similarity - b.similarity);

  writeJsonToFile(config.classifiedOutputPath, sortedBySimilarity);
  console.log(
    `------------------------------------------------IMPORTANT------------------------------------------------------------
The algorithm may identify weak similarities (typically with a similarity rate of 0 to 0.3) between unrelated emails. 
Related emails generally have a higher similarity rate (0.7+).
Inspect '${config.classifiedOutputPath}' to determine the appropriate similarity threshold and adjust it in .env.
Results with a similarity below the threshold will be classified as 'not_recognized'. (Default threshold = 0.5)
---------------------------------------------------------------------------------------------------------------------\n`,
  );
}
