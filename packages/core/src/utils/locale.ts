import { readFile, writeFile, readDir, isDirectory, isFile } from './files';
import type { LocaleData } from '../types';

export const readLocaleFile = (filePath: string): LocaleData => {
  try {
    const content = readFile(filePath);
    const data = JSON.parse(content);

    return data || {};
  } catch {
    throw new Error(`Failed to read locale file: ${filePath}`);
  }
};

export const writeLocaleFile = (filePath: string, data: LocaleData) => {
  try {
    const content = JSON.stringify(data, null, 2);
    writeFile(filePath, content);
  } catch {
    throw new Error(`Failed to write locale file: ${filePath}`);
  }
};

export const findLocaleFiles = (directory: string) => {
  try {
    const files = readDir(directory);

    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => `${directory}/${file}`);
  } catch {
    throw new Error(`Failed to read directory: ${directory}`);
  }
};

export const sortLocaleData = (data: LocaleData) => {
  const sortedKeys = Object.keys(data).sort();
  const sortedData: LocaleData = {};

  for (const key of sortedKeys) {
    sortedData[key] = data[key];
  }

  return sortedData;
};

export const hasKey = (data: LocaleData, key: string) => key in data;

export const addKey = (
  data: LocaleData,
  key: string,
  value: string
): LocaleData => ({ ...data, [key]: value });

export const removeKey = (data: LocaleData, key: string): LocaleData => {
  const newData = { ...data };
  delete newData[key];

  return newData;
};

export function getFilesFromDirectory(directory: string) {
  try {
    const files = findLocaleFiles(directory);
    if (files.length === 0) {
      console.log(`⚠️  No locale files found in directory: ${directory}`);
    }
    return files;
  } catch {
    console.error(`❌ Failed to read directory: ${directory}`);
    process.exit(1);
  }
}

function processFiles(
  files: string[],
  key: string,
  value: string,
  force: boolean,
  isDir: boolean
) {
  let addedCount = 0;
  let skippedCount = 0;
  let createdCount = 0;

  for (const filePath of files) {
    const result = addKeyToFile(filePath, key, value, force, isDir);

    if (result.success) {
      addedCount++;
      if (result.created) {
        createdCount++;
      }
    } else if (result.skipped) {
      skippedCount++;
    }
  }

  if (isDir) {
    console.log(`\n📊 Summary:`);
    console.log(`  Files processed: ${addedCount + skippedCount}`);
    console.log(`  Keys added: ${addedCount}`);
    console.log(`  Keys skipped (already exist): ${skippedCount}`);
    if (createdCount > 0) {
      console.log(`  New files created: ${createdCount}`);
    }
  }
}

/**
 * Adds a key to a single file
 * @returns Object with success status and additional info
 */
export function addKeyToFile(
  filePath: string,
  key: string,
  value: string,
  force: boolean,
  isDirectory: boolean
) {
  try {
    // Read existing locale file
    let data: LocaleData = {};
    let created = false;

    try {
      data = readLocaleFile(filePath);
    } catch {
      // If file does not exist, create a new one
      data = {};
      created = true;
      console.log(`📄 Created new locale file: ${filePath}`);
    }

    // Check if key already exists
    if (hasKey(data, key) && !force) {
      const message = isDirectory
        ? `⚠️  Key '${key}' already exists in ${filePath} with value: '${data[key]}'`
        : `⚠️  Key '${key}' already exists with value: '${data[key]}'`;

      console.log(message);

      if (!isDirectory) {
        console.log('Use --force to overwrite or choose a different key');
        process.exit(1);
      }

      return { success: false, skipped: true, created: false };
    }

    data = addKey(data, key, value);

    writeLocaleFile(filePath, data);

    if (isDirectory) {
      console.log(`✅ Added to ${filePath}`);
    } else {
      console.log(`✅ Added translation entry:`);
      console.log(`   Key: ${key}`);
      console.log(`   Value: ${value}`);
      console.log(`   File: ${filePath}`);
    }

    return { success: true, skipped: false, created };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return { success: false, skipped: false, created: false };
  }
}

/**
 * Adds a translation key to one or multiple locale files
 * @param path - File path or directory path
 * @param key - Translation key to add
 * @param value - Translation value
 * @param force - Whether to force overwrite existing keys
 */
export function addToFiles(
  path: string,
  key: string,
  value: string,
  force: boolean
) {
  if (isDirectory(path)) {
    const files = getFilesFromDirectory(path);
    console.log(`🔍 Found ${files.length} locale files in ${path}`);
    processFiles(files, key, value, force, true);
  } else {
    // Check if file exists, if not, it might be a directory that doesn't exist
    if (isFile(path)) {
      const files = [path];
      processFiles(files, key, value, force, false);
    } else {
      console.error(`❌ Path does not exist: ${path}`);
      process.exit(1);
    }
  }
}

function processDeleteFiles(files: string[], key: string, isDir: boolean) {
  let deletedCount = 0;
  let skippedCount = 0;

  for (const filePath of files) {
    const result = deleteKeyFromFile(filePath, key, isDir);

    if (result.success) {
      deletedCount++;
    } else if (result.skipped) {
      skippedCount++;
    }
  }

  if (isDir) {
    console.log(`\n📊 Summary:`);
    console.log(`  Files processed: ${deletedCount + skippedCount}`);
    console.log(`  Keys deleted: ${deletedCount}`);
    console.log(`  Keys skipped (not found): ${skippedCount}`);
  }
}

/**
 * Deletes a key from a single file
 * @returns Object with success status and additional info
 */
export function deleteKeyFromFile(
  filePath: string,
  key: string,
  isDirectory: boolean
) {
  try {
    let data: LocaleData;

    try {
      data = readLocaleFile(filePath);
    } catch {
      if (isDirectory) {
        return { success: false, skipped: true };
      }
      console.error(`❌ Failed to read locale file: ${filePath}`);
      console.error('Make sure the file exists and is a valid JSON file');
      process.exit(1);
    }

    if (!hasKey(data, key)) {
      if (isDirectory) {
        console.log(`⚠️  Key '${key}' not found in ${filePath}`);
        return { success: false, skipped: true };
      }
      console.error(`❌ Key '${key}' not found in file: ${filePath}`);
      process.exit(1);
    }

    const newData = removeKey(data, key);
    writeLocaleFile(filePath, newData);

    if (isDirectory) {
      console.log(`✅ Deleted from ${filePath}`);
    } else {
      console.log(`✅ Successfully deleted translation entry: ${key}`);
      console.log(`📄 Updated file: ${filePath}`);
    }

    return { success: true, skipped: false };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return { success: false, skipped: false };
  }
}

/**
 * Deletes a translation key from one or multiple locale files
 * @param path - File path or directory path
 * @param key - Translation key to delete
 */
export function deleteFromFiles(path: string, key: string) {
  if (isDirectory(path)) {
    const files = getFilesFromDirectory(path);
    console.log(`🔍 Found ${files.length} locale files in ${path}`);
    processDeleteFiles(files, key, true);
  } else {
    // Check if file exists, if not, it might be a directory that doesn't exist
    if (isFile(path)) {
      const files = [path];
      processDeleteFiles(files, key, false);
    } else {
      console.error(`❌ Path does not exist: ${path}`);
      process.exit(1);
    }
  }
}
