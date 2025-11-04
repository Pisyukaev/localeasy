import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  readLocaleFile,
  writeLocaleFile,
  findLocaleFiles,
  sortLocaleData,
  hasKey,
  addKey,
  removeKey,
  getFilesFromDirectory,
  addKeyToFile,
  addToFiles,
} from './locale';
import type { LocaleData } from '../types';

const TEST_DIR = path.join(process.cwd(), 'test-temp-locale');

describe('locale', () => {
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock process.exit to throw instead of actually exiting
    vi.spyOn(process, 'exit').mockImplementation(
      (code?: number | string | null) => {
        throw new Error(`process.exit(${code ?? 0})`);
      }
    );
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }

    // Restore mocks
    vi.restoreAllMocks();
  });

  describe('readLocaleFile', () => {
    it('should read and parse JSON locale file', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      const data: LocaleData = { hello: 'Hello', world: 'World' };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      const result = readLocaleFile(filePath);

      expect(result).toEqual(data);
    });

    it('should return empty object for empty JSON file', () => {
      const filePath = path.join(TEST_DIR, 'empty.json');
      fs.writeFileSync(filePath, '{}');

      const result = readLocaleFile(filePath);

      expect(result).toEqual({});
    });

    it('should throw error for invalid JSON', () => {
      const filePath = path.join(TEST_DIR, 'invalid.json');
      fs.writeFileSync(filePath, '{ invalid json }');

      expect(() => readLocaleFile(filePath)).toThrow(
        'Failed to read locale file'
      );
    });

    it('should throw error for non-existent file', () => {
      const filePath = path.join(TEST_DIR, 'non-existent.json');

      expect(() => readLocaleFile(filePath)).toThrow(
        'Failed to read locale file'
      );
    });
  });

  describe('writeLocaleFile', () => {
    it('should write locale data to file', () => {
      const filePath = path.join(TEST_DIR, 'output.json');
      const data: LocaleData = { hello: 'Hello', world: 'World' };

      writeLocaleFile(filePath, data);

      expect(fs.existsSync(filePath)).toBe(true);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(content).toEqual(data);
    });

    it('should format JSON with 2 spaces indentation', () => {
      const filePath = path.join(TEST_DIR, 'formatted.json');
      const data: LocaleData = { hello: 'Hello', world: 'World' };

      writeLocaleFile(filePath, data);

      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('  "hello"');
      expect(content).toContain('  "world"');
    });

    it('should throw error if write fails', () => {
      const filePath = path.join('/invalid/path/output.json');
      const data: LocaleData = { hello: 'Hello' };

      expect(() => writeLocaleFile(filePath, data)).toThrow(
        'Failed to write locale file'
      );
    });
  });

  describe('findLocaleFiles', () => {
    it('should find all JSON files in directory', () => {
      const file1 = path.join(TEST_DIR, 'en.json');
      const file2 = path.join(TEST_DIR, 'ru.json');
      const file3 = path.join(TEST_DIR, 'not-json.txt');
      fs.writeFileSync(file1, '{}');
      fs.writeFileSync(file2, '{}');
      fs.writeFileSync(file3, 'content');

      const result = findLocaleFiles(TEST_DIR);

      expect(result).toHaveLength(2);
      // Normalize paths for cross-platform compatibility
      const normalizedResult = result.map((p) => path.normalize(p));
      expect(normalizedResult).toContain(path.normalize(file1));
      expect(normalizedResult).toContain(path.normalize(file2));
      expect(normalizedResult).not.toContain(path.normalize(file3));
    });

    it('should return empty array if no JSON files found', () => {
      const file1 = path.join(TEST_DIR, 'file.txt');
      fs.writeFileSync(file1, 'content');

      const result = findLocaleFiles(TEST_DIR);

      expect(result).toEqual([]);
    });

    it('should throw error for non-existent directory', () => {
      const nonExistentDir = path.join(TEST_DIR, 'non-existent');

      expect(() => findLocaleFiles(nonExistentDir)).toThrow(
        'Failed to read directory'
      );
    });
  });

  describe('sortLocaleData', () => {
    it('should sort keys alphabetically', () => {
      const data: LocaleData = {
        zebra: 'Zebra',
        apple: 'Apple',
        banana: 'Banana',
      };

      const result = sortLocaleData(data);

      const keys = Object.keys(result);
      expect(keys).toEqual(['apple', 'banana', 'zebra']);
      expect(result).toEqual({
        apple: 'Apple',
        banana: 'Banana',
        zebra: 'Zebra',
      });
    });

    it('should handle empty object', () => {
      const data: LocaleData = {};

      const result = sortLocaleData(data);

      expect(result).toEqual({});
    });

    it('should preserve values when sorting', () => {
      const data: LocaleData = {
        c: 'Value C',
        a: 'Value A',
        b: 'Value B',
      };

      const result = sortLocaleData(data);

      expect(result.a).toBe('Value A');
      expect(result.b).toBe('Value B');
      expect(result.c).toBe('Value C');
    });
  });

  describe('hasKey', () => {
    it('should return true if key exists', () => {
      const data: LocaleData = { hello: 'Hello', world: 'World' };

      expect(hasKey(data, 'hello')).toBe(true);
      expect(hasKey(data, 'world')).toBe(true);
    });

    it('should return false if key does not exist', () => {
      const data: LocaleData = { hello: 'Hello' };

      expect(hasKey(data, 'world')).toBe(false);
      expect(hasKey(data, 'test')).toBe(false);
    });

    it('should return false for empty object', () => {
      const data: LocaleData = {};

      expect(hasKey(data, 'any')).toBe(false);
    });
  });

  describe('addKey', () => {
    it('should add new key to data', () => {
      const data: LocaleData = { hello: 'Hello' };

      const result = addKey(data, 'world', 'World');

      expect(result).toEqual({ hello: 'Hello', world: 'World' });
      expect(data).toEqual({ hello: 'Hello' }); // Original should not be modified
    });

    it('should overwrite existing key', () => {
      const data: LocaleData = { hello: 'Hello' };

      const result = addKey(data, 'hello', 'Hi');

      expect(result).toEqual({ hello: 'Hi' });
    });

    it('should add key to empty object', () => {
      const data: LocaleData = {};

      const result = addKey(data, 'hello', 'Hello');

      expect(result).toEqual({ hello: 'Hello' });
    });
  });

  describe('removeKey', () => {
    it('should remove key from data', () => {
      const data: LocaleData = { hello: 'Hello', world: 'World' };

      const result = removeKey(data, 'hello');

      expect(result).toEqual({ world: 'World' });
      expect(data).toEqual({ hello: 'Hello', world: 'World' }); // Original should not be modified
    });

    it('should return same object if key does not exist', () => {
      const data: LocaleData = { hello: 'Hello' };

      const result = removeKey(data, 'world');

      expect(result).toEqual({ hello: 'Hello' });
    });

    it('should handle empty object', () => {
      const data: LocaleData = {};

      const result = removeKey(data, 'any');

      expect(result).toEqual({});
    });
  });

  describe('getFilesFromDirectory', () => {
    it('should return locale files from directory', () => {
      const file1 = path.join(TEST_DIR, 'en.json');
      const file2 = path.join(TEST_DIR, 'ru.json');
      fs.writeFileSync(file1, '{}');
      fs.writeFileSync(file2, '{}');

      const result = getFilesFromDirectory(TEST_DIR);

      expect(result).toHaveLength(2);
      // Normalize paths for cross-platform compatibility
      const normalizedResult = result.map((p) => path.normalize(p));
      expect(normalizedResult).toContain(path.normalize(file1));
      expect(normalizedResult).toContain(path.normalize(file2));
    });

    it('should log warning and return empty array if no files found', () => {
      const result = getFilesFromDirectory(TEST_DIR);

      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No locale files found')
      );
    });

    it('should exit process on error', () => {
      const nonExistentDir = path.join(TEST_DIR, 'non-existent');

      expect(() => getFilesFromDirectory(nonExistentDir)).toThrow(
        'process.exit(1)'
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to read directory')
      );
    });
  });

  describe('addKeyToFile', () => {
    it('should add key to existing file', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      const initialData: LocaleData = { hello: 'Hello' };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));

      const result = addKeyToFile(filePath, 'world', 'World', false, false);

      expect(result.success).toBe(true);
      expect(result.skipped).toBe(false);
      expect(result.created).toBe(false);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(fileData).toEqual({ hello: 'Hello', world: 'World' });
    });

    it('should create new file if it does not exist', () => {
      const filePath = path.join(TEST_DIR, 'new.json');

      const result = addKeyToFile(filePath, 'hello', 'Hello', false, false);

      expect(result.success).toBe(true);
      expect(result.created).toBe(true);
      expect(fs.existsSync(filePath)).toBe(true);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(fileData).toEqual({ hello: 'Hello' });
    });

    it('should skip existing key when force is false', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      const initialData: LocaleData = { hello: 'Hello' };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));

      const result = addKeyToFile(filePath, 'hello', 'Hi', false, true);

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(fileData).toEqual({ hello: 'Hello' }); // Should not be overwritten
    });

    it('should overwrite existing key when force is true', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      const initialData: LocaleData = { hello: 'Hello' };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));

      const result = addKeyToFile(filePath, 'hello', 'Hi', true, false);

      expect(result.success).toBe(true);
      expect(result.skipped).toBe(false);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(fileData).toEqual({ hello: 'Hi' });
    });

    it('should exit process when key exists and not in directory mode', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      const initialData: LocaleData = { hello: 'Hello' };
      fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));

      // Clear any previous calls to process.exit
      vi.mocked(process.exit).mockClear();

      // Call the function - it should trigger process.exit(1) which is mocked to throw
      try {
        addKeyToFile(filePath, 'hello', 'Hi', false, false);
      } catch (error: any) {
        // process.exit is mocked to throw, so we expect an error
        expect(error.message).toContain('process.exit');
      }

      // Verify that process.exit was called with code 1
      expect(process.exit).toHaveBeenCalledWith(1);
    });

    it('should return error result on file write failure', () => {
      const filePath = path.join('/invalid/path/file.json');
      const result = addKeyToFile(filePath, 'hello', 'Hello', false, false);

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(false);
      expect(result.created).toBe(false);
    });
  });

  describe('addToFiles', () => {
    it('should add key to single file', () => {
      const filePath = path.join(TEST_DIR, 'en.json');
      fs.writeFileSync(filePath, '{}');

      addToFiles(filePath, 'hello', 'Hello', false);

      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(fileData).toEqual({ hello: 'Hello' });
    });

    it('should add key to all files in directory', () => {
      const file1 = path.join(TEST_DIR, 'en.json');
      const file2 = path.join(TEST_DIR, 'ru.json');
      fs.writeFileSync(file1, '{}');
      fs.writeFileSync(file2, '{}');

      addToFiles(TEST_DIR, 'hello', 'Hello', false);

      const file1Data = JSON.parse(fs.readFileSync(file1, 'utf8'));
      const file2Data = JSON.parse(fs.readFileSync(file2, 'utf8'));
      expect(file1Data).toEqual({ hello: 'Hello' });
      expect(file2Data).toEqual({ hello: 'Hello' });
    });

    it('should exit process if path does not exist', () => {
      const nonExistentPath = path.join(TEST_DIR, 'non-existent.json');

      expect(() =>
        addToFiles(nonExistentPath, 'hello', 'Hello', false)
      ).toThrow('process.exit(1)');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Path does not exist')
      );
    });
  });
});
