import * as fs from 'fs';

export const readFile = (path: string) => {
  return fs.readFileSync(path, 'utf8');
};

export const writeFile = (path: string, data: string) => {
  return fs.writeFileSync(path, data);
};

export const readDir = (path: string) => {
  return fs.readdirSync(path);
};

export const createDir = (path: string) => {
  return fs.mkdirSync(path, { recursive: true });
};

export const deleteFile = (path: string) => {
  return fs.unlinkSync(path);
};

export const deleteDir = (path: string) => {
  return fs.rmSync(path, { recursive: true });
};

export const isDirectory = (path: string) => {
  try {
    return fs.statSync(path).isDirectory();
  } catch {
    return false;
  }
};

export const isFile = (path: string) => {
  try {
    return fs.statSync(path).isFile();
  } catch {
    return false;
  }
};
