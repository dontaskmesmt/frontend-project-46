import { parseFile } from './parsers.js';

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  
  console.log('File 1 data:', data1);
  console.log('File 2 data:', data2);
  console.log('Format:', format);
  
  return 'diff result';
};

export default genDiff;