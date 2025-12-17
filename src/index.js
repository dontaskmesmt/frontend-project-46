import { parseFile } from './parsers.js'
import _ from 'lodash'

const buildDiff = (data1, data2) => {
  const keys1 = Object.keys(data1)
  const keys2 = Object.keys(data2)
  const allKeys = _.sortBy(_.union(keys1, keys2))

  const diff = allKeys.map((key) => {
    const hasIn1 = key in data1
    const hasIn2 = key in data2

    if (!hasIn2) {
      return { key, value: data1[key], type: 'removed' }
    }

    if (!hasIn1) {
      return { key, value: data2[key], type: 'added' }
    }

    if (data1[key] === data2[key]) {
      return { key, value: data1[key], type: 'unchanged' }
    }

    return {
      key,
      oldValue: data1[key],
      newValue: data2[key],
      type: 'changed',
    }
  })

  return diff
}

const formatDiff = (diff) => {
  const lines = diff.map((item) => {
    switch (item.type) {
      case 'removed':
        return `  - ${item.key}: ${item.value}`
      case 'added':
        return `  + ${item.key}: ${item.value}`
      case 'unchanged':
        return `    ${item.key}: ${item.value}`
      case 'changed':
        return [
          `  - ${item.key}: ${item.oldValue}`,
          `  + ${item.key}: ${item.newValue}`,
        ].join('\n')
      default:
        return ''
    }
  })

  return `{\n${lines.join('\n')}\n}`
}

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const data1 = parseFile(filepath1)
  const data2 = parseFile(filepath2)

  const diff = buildDiff(data1, data2)
  return formatDiff(diff)
}

export default genDiff
