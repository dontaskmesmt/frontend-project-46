import { parseFile } from './parsers.js'
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

const formatStylish = (diff, depth = 1) => {
  const indent = ' '.repeat(4 * depth - 2)
  const bracketIndent = ' '.repeat(4 * (depth - 1))
  
  const lines = diff.map((node) => {
    const { key, type } = node
    
    switch (type) {
      case 'nested':
        return `${indent}  ${key}: {\n${formatStylish(node.children, depth + 1)}\n${bracketIndent}  }`
      
      case 'added':
        return `${indent}+ ${key}: ${formatValue(node.value, depth)}`
      
      case 'removed':
        return `${indent}- ${key}: ${formatValue(node.value, depth)}`
      
      case 'changed':
        return [
          `${indent}- ${key}: ${formatValue(node.oldValue, depth)}`,
          `${indent}+ ${key}: ${formatValue(node.newValue, depth)}`
        ].join('\n')
      
      case 'unchanged':
        return `${indent}  ${key}: ${formatValue(node.value, depth)}`
      
      default:
        return ''
    }
  })
  
  return lines.join('\n')
}

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(4 * depth)
    const bracketIndent = ' '.repeat(4 * (depth - 1))
    const entries = Object.entries(value)
    
    if (entries.length === 0) {
      return '{}'
    }
    
    const lines = entries.map(([key, val]) => {
      return `${indent}  ${key}: ${formatValue(val, depth + 1)}`
    })
    
    return `{\n${lines.join('\n')}\n${bracketIndent}  }`
  }
  
  if (typeof value === 'string') {
    return value
  }
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'boolean') {
    return value.toString()
  }
  return value
}

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1)
  const data2 = parseFile(filepath2)
  
  const diff = buildDiff(data1, data2)
  
  if (format === 'stylish') {
    return `{\n${formatStylish(diff)}\n}`
  }
  
  throw new Error(`Unsupported format: ${format}`)
}

export default genDiff