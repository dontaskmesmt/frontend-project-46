import _ from 'lodash'

const formatValue = (value, depth = 0) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(4 * (depth + 1))
    const bracketIndent = ' '.repeat(4 * depth)

    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'

    const lines = entries.map(([key, val]) => {
      return `${indent}${key}: ${formatValue(val, depth + 1)}`
    })

    return `{\n${lines.join('\n')}\n${bracketIndent}}`
  }

  if (typeof value === 'string') return value
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()
  if (value === undefined) return ''
  return value
}

const formatStylish = (diff, depth = 0) => {
  const indentSize = 4
  const baseIndent = ' '.repeat(indentSize * depth)
  const elementIndent = `${baseIndent}  `
  const nestedIndent = baseIndent

  const lines = diff.map((node) => {
    const { key, type } = node

    switch (type) {
      case 'nested':
        return `${elementIndent}  ${key}: {\n${formatStylish(node.children, depth + 1)}\n${elementIndent}  }`

      case 'added':
        return `${elementIndent}+ ${key}: ${formatValue(node.value, depth + 1)}`

      case 'removed':
        return `${elementIndent}- ${key}: ${formatValue(node.value, depth + 1)}`

      case 'changed':
        return [
          `${elementIndent}- ${key}: ${formatValue(node.oldValue, depth + 1)}`,
          `${elementIndent}+ ${key}: ${formatValue(node.newValue, depth + 1)}`,
        ].join('\n')

      case 'unchanged':
        return `${elementIndent}  ${key}: ${formatValue(node.value, depth + 1)}`

      default:
        return ''
    }
  })

  return lines.join('\n')
}

export default (diff) => `{\n${formatStylish(diff, 0)}\n}`
