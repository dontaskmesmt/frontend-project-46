import _ from 'lodash'

const formatValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]'
  }

  if (typeof value === 'string') {
    return `'${value}'`
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'boolean') {
    return value.toString()
  }

  return value
}

const buildPath = (key, parentPath) => {
  if (!parentPath) {
    return key
  }
  return `${parentPath}.${key}`
}

const formatPlain = (diff, parentPath = '') => {
  const lines = diff.flatMap((node) => {
    const { key, type } = node
    const path = buildPath(key, parentPath)

    switch (type) {
      case 'nested':
        return formatPlain(node.children, path)

      case 'added':
        return `Property '${path}' was added with value: ${formatValue(node.value)}`

      case 'removed':
        return `Property '${path}' was removed`

      case 'changed':
        return `Property '${path}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`

      case 'unchanged':
        return []

      default:
        return []
    }
  })

  return lines.join('\n')
}

export default formatPlain
