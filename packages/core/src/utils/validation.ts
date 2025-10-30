export const validateKey = (key: string) => {
  if (!key || typeof key !== 'string') {
    return false;
  }

  // Check if the key contains only letters, numbers, dots and underscores
  const keyRegex = /^[a-zA-Z0-9._-]+$/;
  return keyRegex.test(key);
};

export const validateLanguage = (language: string) => {
  if (!language || typeof language !== 'string') {
    return false;
  }

  // Check if the language contains only letters and hyphens (e.g. en-US)
  const languageRegex = /^[a-zA-Z-]+$/;
  return languageRegex.test(language) && language.length >= 2;
};

export const validateValue = (value: string) => {
  return value !== null && value !== undefined && typeof value === 'string';
};

export const validateFilePath = (filePath: string) => {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  return filePath.endsWith('.json');
};

export const validateDirectoryPath = (dirPath: string) => {
  return (
    dirPath !== null && dirPath !== undefined && typeof dirPath === 'string'
  );
};
