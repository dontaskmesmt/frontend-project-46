import _ from 'lodash'

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(4 * (depth + 2))
    const bracketIndent = ' '.repeat(4 * (depth + 1))
    
    const entries = Object.entries(value)
    
    if (entries.length === 0) {
      return '{}'
    }
    
    const lines = entries.map(([key, val]) => {
      return `${indent}  ${key}: ${formatValue(val, depth + 1)}`
    })
    
    return `{\n${lines.join('\n')}\n${bracketIndent}  }`
  }
  
  if (typeof value === 'string') return value
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  if (value === undefined) return ''
  return value
}

const formatStylish = (diff, depth = 1) => {
  const indent = ' '.repeat(4 * depth)
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

export default (diff) => `{\n${formatStylish(diff)}\n}`