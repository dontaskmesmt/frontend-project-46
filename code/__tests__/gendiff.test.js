import path from 'path'
import { fileURLToPath } from 'url'
import genDiff from '../src/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename)

describe('Flat files comparison', () => {
  test('JSON files stylish', () => {
    const filepath1 = getFixturePath('file1.json')
    const filepath2 = getFixturePath('file2.json')
    const result = genDiff(filepath1, filepath2, 'stylish')
    expect(result).toContain('- follow: false')
    expect(result).toContain('+ verbose: true')
  })
  
  test('JSON files plain', () => {
    const filepath1 = getFixturePath('file1.json')
    const filepath2 = getFixturePath('file2.json')
    const result = genDiff(filepath1, filepath2, 'plain')
    expect(result).toContain("Property 'follow' was removed")
    expect(result).toContain("Property 'verbose' was added")
    expect(result).toContain("Property 'timeout' was updated")
  })
})

describe('Recursive comparison', () => {
  test('JSON files with nested structures stylish', () => {
    const filepath1 = getFixturePath('file1_recursive.json')
    const filepath2 = getFixturePath('file2_recursive.json')
    const result = genDiff(filepath1, filepath2, 'stylish')
    expect(result).toContain('  common: {')
    expect(result).toContain('    + follow: false')
  })
  
  test('JSON files with nested structures plain', () => {
    const filepath1 = getFixturePath('file1_recursive.json')
    const filepath2 = getFixturePath('file2_recursive.json')
    const result = genDiff(filepath1, filepath2, 'plain')
    
    expect(result).toContain("Property 'common.follow' was added with value: false")
    expect(result).toContain("Property 'common.setting2' was removed")
    expect(result).toContain("Property 'common.setting3' was updated. From true to null")
    expect(result).toContain("Property 'common.setting5' was added with value: [complex value]")
    expect(result).toContain("Property 'group2' was removed")
    expect(result).toContain("Property 'group3' was added with value: [complex value]")
  })
})