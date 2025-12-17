import { readFileSync } from 'fs';
import path from 'path';

const getFileContent = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const fileContent = readFileSync(absolutePath, 'utf8');
  return fileContent;
};

const parseFile = (filepath) => {
  const content = getFileContent(filepath);
  const extension = path.extname(filepath).toLowerCase();
  
  if (extension === '.json') {
    return JSON.parse(content);
  }
  
  throw new Error(`Unsupported file format: ${extension}`);
};

export { getFileContent, parseFile };