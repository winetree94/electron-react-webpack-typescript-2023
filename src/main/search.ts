import { readdir, readFile, stat } from "fs/promises";
import { extname } from "path";

export const getAllFilePath = async (
  path: string,
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
      return getAllFilePath(`${path}/${fileName}`, ignorePatterns, finalResult);
    }
    if (ignorePatterns?.some((pattern) => filePath.includes(pattern))) {
      return;
    }
    finalResult.push(filePath);
  }));

  return finalResult;
}

export const search = async (
  pathes: string[],
  keywords: string[],
  extensions: string[],
  progressCallback?: (progress: number) => void,
): Promise<Record<string, number>> => {
  progressCallback?.(0);
  const result: Record<string, number> = {};

  await Promise.all(pathes.map(async (filePath) => {
    const ext = extname(filePath);
    if (!extensions.includes(ext)) {
      return;
    }
    const stream = await readFile(filePath, 'utf-8');
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'g');
      const matches = stream.match(regex);
      result[keyword] = (result[keyword] || 0) + (matches?.length || 0);
    });
  }));

  return result;
}