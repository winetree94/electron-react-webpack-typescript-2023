import { readdir, readFile, stat, writeFile } from "fs/promises";
import { extname } from "path";

export const getAllFilePath = async (
  path: string,
  extensions: string[],
  ignorePatterns?: string[],
  result?: string[],
): Promise<string[]> => {
  const finalResult = result || [];

  const fileNames = await readdir(path);

  await Promise.all(fileNames.map(async (fileName) => {
    const fileStat = await stat(`${path}/${fileName}`);
    const isDirectory = fileStat.isDirectory();
    const filePath = `${path}/${fileName}`;
    if (isDirectory) {
      return getAllFilePath(`${path}/${fileName}`, extensions, ignorePatterns, finalResult);
    }
    if (ignorePatterns?.some((pattern) => filePath.includes(pattern))) {
      return;
    }
    const ext = extname(filePath);
    if (!extensions.includes(ext)) {
      return;
    }
    finalResult.push(filePath);
  }));

  return finalResult;
}

export const search = async (
  pathes: string[],
  keywords: string[],
): Promise<Record<string, number>> => {
  const result: Record<string, number> = {};

  await Promise.all(pathes.map(async (filePath) => {
    const stream = await readFile(filePath, 'utf-8');
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'g');
      const matches = stream.match(regex);
      result[keyword] = (result[keyword] || 0) + (matches?.length || 0);
    });
  }));

  return result;
}

export interface ChangeModel {
  keys: string[];
  targetKey: string;
}

export const change = async (
  pathes: string[],
  changes: ChangeModel[],
) => {
  return Promise.all(pathes.map(async (filePath) => {
    const stream = await readFile(filePath, 'utf-8');

    const patched = changes.reduce((acc, change) => {
      return change.keys.reduce((result, key) => {
        const regex = new RegExp(key, 'g');
        return result.replace(regex, change.targetKey);
      }, acc);
    }, stream);

    if (stream === patched) {
      return;
    }
    await writeFile(filePath, patched, { encoding: 'utf-8' });
  }));
}