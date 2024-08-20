import { PathOrFileDescriptor } from "fs";
import { readJsonFromFile } from "./fileUtils";

/**
 * Prepares a set of uncategorized emails from the given sample data path.
 *
 * @param {PathOrFileDescriptor} sampleDataPath - The path to the sample data JSON file.
 * @returns {Set<string>} A set of uncategorized emails.
 */
export function prepareUncategorizedEmails(
  sampleDataPath: PathOrFileDescriptor,
): Set<string> {
  // We use Set to avoid email duplications
  const uncategorizedEmails = new Set<string>();
  const data = readJsonFromFile(sampleDataPath);
  for (const record of data) {
    if (record.email) uncategorizedEmails.add(record.email);
    if (record.account_email) uncategorizedEmails.add(record.account_email);
  }
  return uncategorizedEmails;
}

/**
 * Prepares a set of known emails from the given users data path.
 *
 * @param {PathOrFileDescriptor} usersDataPath - The path to the users data JSON file.
 * @returns {Set<string>} A set of known emails.
 */
export function prepareKnownEmails(
  usersDataPath: PathOrFileDescriptor,
): Set<string> {
  // We use Set to avoid email duplications
  const knownEmails = new Set<string>();
  const users = readJsonFromFile(usersDataPath);
  for (const user of users) {
    knownEmails.add(user.email);
  }
  return knownEmails;
}
