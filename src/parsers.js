import { readFileSync } from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const getFileContent = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath)
  return readFileSync(absolutePath, 'utf8')
}

const parseFile = (filepath) => {
  const content = getFileContent(filepath)
  const extension = path.extname(filepath).toLowerCase()

  if (extension === '.json') {
    return JSON.parse(content)
  }

  if (extension === '.yml' || extension === '.yaml') {
    return yaml.load(content)
  }

  throw new Error(`Unsupported file format: ${extension}`)
}

export { parseFile }
