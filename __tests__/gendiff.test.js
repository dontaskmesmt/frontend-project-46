import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename)

test('gendiff flat JSON files', () => {
  const filepath1 = getFixturePath('file1.json')
  const filepath2 = getFixturePath('file2.json')
  
  const result = genDiff(filepath1, filepath2)
  
  expect(result).toContain('- follow: false')
  expect(result).toContain('+ verbose: true')
  expect(result).toContain('- timeout: 50')
  expect(result).toContain('+ timeout: 20')
  expect(result).toContain('host: hexlet.io')
  expect(result).toContain('- proxy: 123.234.53.22')
})

test('gendiff flat YAML files', () => {
  const filepath1 = getFixturePath('file1.yml')
  const filepath2 = getFixturePath('file2.yml')
  
  const result = genDiff(filepath1, filepath2)
  
  expect(result).toContain('- follow: false')
  expect(result).toContain('+ verbose: true')
  expect(result).toContain('- timeout: 50')
  expect(result).toContain('+ timeout: 20')
  expect(result).toContain('host: hexlet.io')
  expect(result).toContain('- proxy: 123.234.53.22')
})

test('gendiff mixed JSON and YAML files', () => {
  const filepath1 = getFixturePath('file1.json')
  const filepath2 = getFixturePath('file2.yml')
  
  const result = genDiff(filepath1, filepath2)
  
  expect(typeof result).toBe('string')
  expect(result.length).toBeGreaterThan(10)
})