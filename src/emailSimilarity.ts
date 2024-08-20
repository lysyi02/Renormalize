import { stringSimilarity } from "string-similarity-js";

/**
 * Prepares an email address for comparison by removing the domain part and numbers from the local part.
 *
 * @param {string} email - The original email address.
 * @returns {string} The prepared email local part (before \@) with numbers removed.
 *
 * @example
 * // Example usage:
 * const email = 'john.doe123@example.com';
 * const preparedEmail = trimEmail(email);
 * console.log(preparedEmail); // Output: 'john.doe'
 */
export function trimEmail(email: string): string {
  return email.split("@")[0].replace(/\d+/g, "");
}

/**
 * Finds the most similar email from a list of known emails.
 * The algorithm may identify weak similarities (typically with a similarity rate of 0 to 0.3) between unrelated emails.
 * Related emails generally have a higher similarity rate (0.5+).
 * Run 'classifyDataset' to
 *
 * @param {string} uncategorized_email - The email to compare against the known emails.
 * @param {Iterable<string>} known_emails - A set of known emails to compare with.
 * @param {number} threshold - The similarity threshold between 0 and 1 for considering an email as similar to any known.
 * @returns {object} - An object containing:
 *   - `mostSimilarEmail`: The known email with the highest similarity coefficient that meets or exceeds the threshold. If no email meets the threshold - empty string.
 *   - `similarity`: The similarity coefficient of the most similar email. If no email meets the threshold, this will be `0`.
 *  */
export function findMostSimilarKnownEmail(
  uncategorized_email: string,
  known_emails: Iterable<string>,
  threshold: number,
): {
  mostSimilarEmail: string;
  similarity: number;
} {
  return Array.from(known_emails).reduce<{
    mostSimilarEmail: string;
    similarity: number;
  }>(
    (accumulator, known_email) => {
      const similarity_rate = stringSimilarity(
        trimEmail(known_email),
        trimEmail(uncategorized_email),
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
