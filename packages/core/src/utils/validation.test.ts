import { describe, it, expect } from 'vitest';
import {
  validateKey,
  validateLanguage,
  validateValue,
  validateFilePath,
  validateDirectoryPath,
} from './validation';

describe('validation', () => {
  describe('validateKey', () => {
    it('should return true for valid keys', () => {
      expect(validateKey('hello')).toBe(true);
      expect(validateKey('hello.world')).toBe(true);
      expect(validateKey('hello_world')).toBe(true);
      expect(validateKey('hello-world')).toBe(true);
      expect(validateKey('hello123')).toBe(true);
      expect(validateKey('hello.world.test')).toBe(true);
      expect(validateKey('a')).toBe(true);
      expect(validateKey('123')).toBe(true);
    });

    it('should return false for invalid keys', () => {
      expect(validateKey('')).toBe(false);
      expect(validateKey('hello world')).toBe(false);
      expect(validateKey('hello@world')).toBe(false);
      expect(validateKey('hello#world')).toBe(false);
      expect(validateKey('hello$world')).toBe(false);
      expect(validateKey('hello%world')).toBe(false);
      expect(validateKey('hello!world')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validateKey(null as any)).toBe(false);
      expect(validateKey(undefined as any)).toBe(false);
      expect(validateKey(123 as any)).toBe(false);
      expect(validateKey({} as any)).toBe(false);
      expect(validateKey([] as any)).toBe(false);
    });
  });

  describe('validateLanguage', () => {
    it('should return true for valid languages', () => {
      expect(validateLanguage('en')).toBe(true);
      expect(validateLanguage('ru')).toBe(true);
      expect(validateLanguage('en-US')).toBe(true);
      expect(validateLanguage('zh-CN')).toBe(true);
      expect(validateLanguage('fr-CA')).toBe(true);
      expect(validateLanguage('ab')).toBe(true);
      expect(validateLanguage('abc')).toBe(true);
    });

    it('should return false for languages shorter than 2 characters', () => {
      expect(validateLanguage('a')).toBe(false);
      expect(validateLanguage('')).toBe(false);
    });

    it('should return false for invalid languages', () => {
      expect(validateLanguage('en_US')).toBe(false);
      expect(validateLanguage('en123')).toBe(false);
      expect(validateLanguage('en@us')).toBe(false);
      expect(validateLanguage('en.us')).toBe(false);
      expect(validateLanguage('en us')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(validateLanguage(null as any)).toBe(false);
      expect(validateLanguage(undefined as any)).toBe(false);
      expect(validateLanguage(123 as any)).toBe(false);
      expect(validateLanguage({} as any)).toBe(false);
      expect(validateLanguage([] as any)).toBe(false);
    });
  });

  describe('validateValue', () => {
    it('should return true for valid string values', () => {
      expect(validateValue('hello')).toBe(true);
      expect(validateValue('')).toBe(true);
      expect(validateValue('Hello, World!')).toBe(true);
      expect(validateValue('123')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(validateValue(null as any)).toBe(false);
      expect(validateValue(undefined as any)).toBe(false);
      expect(validateValue(123 as any)).toBe(false);
      expect(validateValue({} as any)).toBe(false);
      expect(validateValue([] as any)).toBe(false);
    });
  });

  describe('validateFilePath', () => {
    it('should return true for valid file paths', () => {
      expect(validateFilePath('file.json')).toBe(true);
      expect(validateFilePath('./file.json')).toBe(true);
      expect(validateFilePath('/path/to/file.json')).toBe(true);
      expect(validateFilePath('locales/en.json')).toBe(true);
    });

    it('should return false for non-json files', () => {
      expect(validateFilePath('file.txt')).toBe(false);
      expect(validateFilePath('file.js')).toBe(false);
      expect(validateFilePath('file')).toBe(false);
      expect(validateFilePath('file.json.backup')).toBe(false);
    });

    it('should return false for invalid values', () => {
      expect(validateFilePath('')).toBe(false);
      expect(validateFilePath(null as any)).toBe(false);
      expect(validateFilePath(undefined as any)).toBe(false);
      expect(validateFilePath(123 as any)).toBe(false);
      expect(validateFilePath({} as any)).toBe(false);
      expect(validateFilePath([] as any)).toBe(false);
    });
  });

  describe('validateDirectoryPath', () => {
    it('should return true for valid directory paths', () => {
      expect(validateDirectoryPath('./locales')).toBe(true);
      expect(validateDirectoryPath('/path/to/dir')).toBe(true);
      expect(validateDirectoryPath('locales')).toBe(true);
      expect(validateDirectoryPath('')).toBe(true);
    });

    it('should return false for invalid values', () => {
      expect(validateDirectoryPath(null as any)).toBe(false);
      expect(validateDirectoryPath(undefined as any)).toBe(false);
      expect(validateDirectoryPath(123 as any)).toBe(false);
      expect(validateDirectoryPath({} as any)).toBe(false);
      expect(validateDirectoryPath([] as any)).toBe(false);
    });
  });
});
