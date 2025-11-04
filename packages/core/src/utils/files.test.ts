import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  readFile,
  writeFile,
  readDir,
  createDir,
  deleteFile,
  deleteDir,
  isDirectory,
  isFile,
} from './files';

const TEST_DIR = path.join(process.cwd(), 'test-temp');

describe('files', () => {
  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('readFile', () => {
    it('should read file content', () => {
      const filePath = path.join(TEST_DIR, 'test.txt');
      const content = 'Hello, World!';
      fs.writeFileSync(filePath, content);

      const result = readFile(filePath);
      expect(result).toBe(content);
    });

    it('should throw error if file does not exist', () => {
      const filePath = path.join(TEST_DIR, 'non-existent.txt');

      expect(() => readFile(filePath)).toThrow();
    });
  });

  describe('writeFile', () => {
    it('should write content to file', () => {
      const filePath = path.join(TEST_DIR, 'write-test.txt');
      const content = 'Test content';

      writeFile(filePath, content);

      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe(content);
    });

    it('should overwrite existing file', () => {
      const filePath = path.join(TEST_DIR, 'overwrite-test.txt');
      const initialContent = 'Initial';
      const newContent = 'New content';

      fs.writeFileSync(filePath, initialContent);
      writeFile(filePath, newContent);

      expect(fs.readFileSync(filePath, 'utf8')).toBe(newContent);
    });
  });

  describe('readDir', () => {
    it('should read directory contents', () => {
      const file1 = path.join(TEST_DIR, 'file1.txt');
      const file2 = path.join(TEST_DIR, 'file2.txt');
      fs.writeFileSync(file1, 'content1');
      fs.writeFileSync(file2, 'content2');

      const result = readDir(TEST_DIR);

      expect(result).toContain('file1.txt');
      expect(result).toContain('file2.txt');
    });

    it('should throw error if directory does not exist', () => {
      const nonExistentDir = path.join(TEST_DIR, 'non-existent');

      expect(() => readDir(nonExistentDir)).toThrow();
    });
  });

  describe('createDir', () => {
    it('should create directory', () => {
      const dirPath = path.join(TEST_DIR, 'new-dir');

      createDir(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });

    it('should create nested directories with recursive option', () => {
      const dirPath = path.join(TEST_DIR, 'nested', 'deep', 'dir');

      createDir(dirPath);

      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });

    it('should not throw if directory already exists', () => {
      const dirPath = path.join(TEST_DIR, 'existing-dir');
      fs.mkdirSync(dirPath);

      expect(() => createDir(dirPath)).not.toThrow();
    });
  });

  describe('deleteFile', () => {
    it('should delete file', () => {
      const filePath = path.join(TEST_DIR, 'to-delete.txt');
      fs.writeFileSync(filePath, 'content');

      deleteFile(filePath);

      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should throw error if file does not exist', () => {
      const filePath = path.join(TEST_DIR, 'non-existent.txt');

      expect(() => deleteFile(filePath)).toThrow();
    });
  });

  describe('deleteDir', () => {
    it('should delete directory and its contents', () => {
      const dirPath = path.join(TEST_DIR, 'to-delete-dir');
      const filePath = path.join(dirPath, 'file.txt');
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(filePath, 'content');

      deleteDir(dirPath);

      expect(fs.existsSync(dirPath)).toBe(false);
    });
  });

  describe('isDirectory', () => {
    it('should return true for directory', () => {
      const dirPath = path.join(TEST_DIR, 'test-dir');
      fs.mkdirSync(dirPath);

      expect(isDirectory(dirPath)).toBe(true);
    });

    it('should return false for file', () => {
      const filePath = path.join(TEST_DIR, 'test-file.txt');
      fs.writeFileSync(filePath, 'content');

      expect(isDirectory(filePath)).toBe(false);
    });

    it('should return false for non-existent path', () => {
      const nonExistentPath = path.join(TEST_DIR, 'non-existent');

      expect(isDirectory(nonExistentPath)).toBe(false);
    });
  });

  describe('isFile', () => {
    it('should return true for file', () => {
      const filePath = path.join(TEST_DIR, 'test-file.txt');
      fs.writeFileSync(filePath, 'content');

      expect(isFile(filePath)).toBe(true);
    });

    it('should return false for directory', () => {
      const dirPath = path.join(TEST_DIR, 'test-dir');
      fs.mkdirSync(dirPath);

      expect(isFile(dirPath)).toBe(false);
    });

    it('should return false for non-existent path', () => {
      const nonExistentPath = path.join(TEST_DIR, 'non-existent.txt');

      expect(isFile(nonExistentPath)).toBe(false);
    });
  });
});
