import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename)

describe('Flat files comparison', () => {
  test('JSON files', () => {
    const filepath1 = getFixturePath('file1.json')
    const filepath2 = getFixturePath('file2.json')
    const result = genDiff(filepath1, filepath2)
    expect(result).toContain('- follow: false')
    expect(result).toContain('+ verbose: true')
  })

  test('YAML files', () => {
    const filepath1 = getFixturePath('file1.yml')
    const filepath2 = getFixturePath('file2.yml')
    const result = genDiff(filepath1, filepath2)
    expect(result).toContain('- follow: false')
    expect(result).toContain('+ verbose: true')
  })
})

describe('Recursive comparison', () => {
  test('JSON files with nested structures', () => {
    const filepath1 = getFixturePath('file1_recursive.json')
    const filepath2 = getFixturePath('file2_recursive.json')
    const result = genDiff(filepath1, filepath2, 'stylish')
    
    expect(result).toContain('  common: {')
    expect(result).toContain('    + follow: false')
    expect(result).toContain('    - setting3: true')
    expect(result).toContain('    + setting3: null')
    expect(result).toContain('      doge: {')
    expect(result).toContain('        - wow:')
    expect(result).toContain('        + wow: so much')
    expect(result).toContain('  - group2: {')
    expect(result).toContain('  + group3: {')
  })

  test('YAML files with nested structures', () => {
    const filepath1 = getFixturePath('file1_recursive.yml')
    const filepath2 = getFixturePath('file2_recursive.yml')
    const result = genDiff(filepath1, filepath2, 'stylish')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(100)
  })
})