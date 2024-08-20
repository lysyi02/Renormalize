import fs, { PathOrFileDescriptor } from "fs";

function readJsonFromFile(filename: PathOrFileDescriptor) {
  try {
    const jsonString = fs.readFileSync(filename, "utf8");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
}

function writeJsonToFile(filename: PathOrFileDescriptor, data: any) {
  try {
    // Create directories if needed
    const directories = filename.toString().split("/").slice(0, -1).join("/");
    if (directories) {
      fs.mkdirSync(directories, {
        recursive: true,
      });
    }
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing JSON file:", error);
    throw error;
  }
}

export { readJsonFromFile, writeJsonToFile };
