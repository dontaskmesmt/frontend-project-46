import { parseFile } from './parsers.js'
import getFormatter from './formatters/index.js'
import _ from 'lodash'

const buildDiff = (data1, data2) => {
  const keys1 = Object.keys(data1)
  const keys2 = Object.keys(data2)
  const allKeys = _.sortBy(_.union(keys1, keys2))
  
  return allKeys.map((key) => {
    const hasIn1 = key in data1
    const hasIn2 = key in data2
    const value1 = data1[key]
    const value2 = data2[key]
    
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildDiff(value1, value2)
      }
    }
    
    if (!hasIn2) {
      return { key, type: 'removed', value: value1 }
    }
    
    if (!hasIn1) {
      return { key, type: 'added', value: value2 }
    }
    
    if (_.isEqual(value1, value2)) {
      return { key, type: 'unchanged', value: value1 }
    }
    
    return {
      key,
      type: 'changed',
      oldValue: value1,
      newValue: value2
    }
  })
}

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1)
  const data2 = parseFile(filepath2)
  
  const diff = buildDiff(data1, data2)
  const formatter = getFormatter(format)
  
  return formatter(diff)
}

export default genDiff