#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const docsRoot = path.resolve('docs')
const strictIslandsRoot = path.join(docsRoot, 'examples', 'islands')
const write = process.argv.includes('--write')
const check = process.argv.includes('--check')

if (write === check) {
  console.error('Usage: node scripts/pair-doc-examples.mjs --write|--check')
  process.exit(2)
}

const sourceLanguages = new Set(['js', 'javascript', 'ts', 'typescript'])

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return markdownFiles(target)
    return entry.isFile() && entry.name.endsWith('.md') ? [target] : []
  })
}

function fenceAt(line) {
  const match = line.match(/^(\s*)```([\w+-]*)\s*$/)
  if (!match || !sourceLanguages.has(match[2])) return null
  return { indent: match[1], language: match[2] }
}

function languageTabBefore(lines, index) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const trimmed = lines[cursor].trim()
    if (/^=== "(?:JavaScript|TypeScript)"$/.test(trimmed)) return trimmed
    if (/^=== /.test(trimmed) || /^#{1,6}\s/.test(trimmed) || trimmed === '<!-- cami-language-pair -->') return ''
  }
  return ''
}

function diagnosticsFor(source, fileName) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: false,
    },
    fileName,
    reportDiagnostics: true,
  })
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  )
  return { result, errors }
}

function strictIslandOutputs() {
  const configPath = path.join(strictIslandsRoot, 'tsconfig.json')
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) return { errors: [formatDiagnostics([configFile.error])], outputs: new Map() }

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, strictIslandsRoot)
  const program = ts.createProgram(parsed.fileNames, parsed.options)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length) return { errors: [formatDiagnostics(diagnostics)], outputs: new Map() }

  const outputs = new Map()
  for (const fileName of parsed.fileNames.filter((name) => name.endsWith('.ts'))) {
    const source = fs.readFileSync(fileName, 'utf8')
    const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2022, true)
    let typeSyntaxCount = 0
    const explicitAny = []
    const inspect = (node) => {
      if (
        ts.isInterfaceDeclaration(node)
        || ts.isTypeAliasDeclaration(node)
        || ts.isTypeAnnotationNode?.(node)
        || node.type
        || (node.typeArguments?.length ?? 0) > 0
        || ts.isSatisfiesExpression?.(node)
      ) typeSyntaxCount += 1
      if (node.kind === ts.SyntaxKind.AnyKeyword) explicitAny.push(node.getStart(sourceFile))
      ts.forEachChild(node, inspect)
    }
    inspect(sourceFile)
    if (typeSyntaxCount === 0) {
      return { errors: [`${fileName}: strict example has no authored TypeScript type syntax`], outputs: new Map() }
    }
    if (explicitAny.length) {
      return { errors: [`${fileName}: strict example uses explicit any`], outputs: new Map() }
    }
    const result = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        removeComments: false,
      },
      fileName,
    })
    const browserGlobal = result.outputText
      .replace(/^import\s+\{([^}]+)\}\s+from\s+['"]cami['"];?\s*$/m, 'const {$1} = cami')
      .trimEnd()
      .concat('\n')
    const normalize = (value) => value.replace(/[\s;]+/g, '')
    if (normalize(browserGlobal) === normalize(source)) {
      return { errors: [`${fileName}: generated JavaScript is mechanically identical to TypeScript`], outputs: new Map() }
    }
    outputs.set(fileName.replace(/\.ts$/, '.js'), browserGlobal)
  }
  return { errors: [], outputs }
}

function markdownTypeScriptBlocks(fileName) {
  const markdown = fs.readFileSync(fileName, 'utf8')
  return [...markdown.matchAll(/=== "TypeScript"\s*\n\s*```typescript\n(.*?)\n\s*```/gs)].map((match) =>
    match[1]
      .split('\n')
      .map((line) => line.startsWith('    ') ? line.slice(4) : line)
      .join('\n'),
  )
}

function strictTutorialErrors() {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cami-doc-tutorials-'))
  try {
    const targets = [
      { name: 'first-island.ts', file: path.join(docsRoot, 'tutorials', 'first-island.md'), blocks: [0] },
      { name: 'shared-state.ts', file: path.join(docsRoot, 'tutorials', 'shared-state.md'), blocks: [0, 1, 2] },
    ]
    const rootNames = [path.join(docsRoot, 'examples', 'package-counter.ts')]
    for (const target of targets) {
      const blocks = markdownTypeScriptBlocks(target.file)
      const source = target.blocks.map((index) => blocks[index]).join('\n\n')
      const output = path.join(temporaryRoot, target.name)
      fs.writeFileSync(output, source)
      rootNames.push(output)
    }
    const program = ts.createProgram(rootNames, {
      strict: true,
      noEmit: true,
      target: ts.ScriptTarget.ES2022,
      lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      skipLibCheck: true,
      baseUrl: process.cwd(),
      paths: { cami: ['build/cami.d.ts'] },
    })
    return ts.getPreEmitDiagnostics(program).map((diagnostic) => formatDiagnostics([diagnostic]))
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true })
  }
}

function formatDiagnostics(errors) {
  return errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')).join('; ')
}

function syntaxErrorsFor(source, fileName) {
  const candidates = [
    source,
    `class DocumentationFragment {\n${source}\n}`,
    `const documentationFragment = html\`${source}\``,
  ]
  let shortest = null
  for (const candidate of candidates) {
    const { errors } = diagnosticsFor(candidate, fileName)
    if (!errors.length) return []
    if (!shortest || errors.length < shortest.length) shortest = errors
  }
  return shortest ?? []
}

function indentBlock(lines, prefix) {
  return lines.map((line) => `${prefix}${line}`)
}

function pairedBlock(indent, javascript, typescript) {
  return [
    `${indent}<!-- cami-language-pair -->`,
    `${indent}=== "JavaScript"`,
    '',
    ...indentBlock([
      '```javascript',
      ...javascript.split('\n'),
      '```',
    ], `${indent}    `),
    '',
    `${indent}=== "TypeScript"`,
    '',
    ...indentBlock([
      '```typescript',
      ...typescript.split('\n'),
      '```',
    ], `${indent}    `),
  ]
}

function typescriptModule(source) {
  let replaced = false
  let output = source.replace(
    /(?:const|let|var)[ \t]*\{([^}]+)\}[ \t]*=[ \t]*cami[ \t]*;?/,
    (_match, names) => {
      replaced = true
      return `import {${names}} from 'cami'`
    },
  )
  if (!replaced && /\bcami\./.test(output)) output = `import * as cami from 'cami'\n\n${output}`
  return output.trim()
}

function splitWorkedExample(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')

  for (let index = 0; index < lines.length; index += 1) {
    if (!/^```html\s*$/.test(lines[index])) continue
    let cursor = index + 1
    while (cursor < lines.length && !/^```\s*$/.test(lines[cursor])) cursor += 1
    if (cursor >= lines.length) throw new Error(`${file}:${index + 1}: unclosed HTML fence`)

    const html = lines.slice(index + 1, cursor).join('\n')
    const scripts = []
    const shell = html.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (match, _attributes, source) => {
      if (!source.trim()) return match
      scripts.push(source.trim())
      return '<script type="module" src="./island.js"></script>'
    })
    if (!scripts.length) continue

    for (let heading = index - 1; heading >= 0; heading -= 1) {
      if (!lines[heading].trim()) continue
      if (/^## (?:HTML|Source):?\s*$/.test(lines[heading])) lines[heading] = '## Page shell'
      break
    }

    const javascript = scripts.join('\n\n')
    const typescript = typescriptModule(javascript)
    const replacement = [
      '```html',
      ...shell.split('\n'),
      '```',
      '',
      file.includes(`${path.sep}learn_by_example${path.sep}`) ? '## Island source' : '### Island source',
      '',
      ...pairedBlock('', javascript, typescript),
    ]
    lines.splice(index, cursor - index + 1, ...replacement)
    index += replacement.length - 1
  }

  fs.writeFileSync(file, lines.join('\n'))
}

function transform(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const output = []

  for (let index = 0; index < lines.length; index += 1) {
    const fence = fenceAt(lines[index])
    if (!fence) {
      output.push(lines[index])
      continue
    }

    if (languageTabBefore(lines, index)) {
      output.push(lines[index])
      continue
    }

    const body = []
    let cursor = index + 1
    const close = new RegExp(`^${fence.indent.replaceAll(' ', '\\s')}\`\`\`\\s*$`)
    while (cursor < lines.length && !close.test(lines[cursor])) {
      body.push(lines[cursor].startsWith(fence.indent) ? lines[cursor].slice(fence.indent.length) : lines[cursor])
      cursor += 1
    }
    if (cursor >= lines.length) throw new Error(`${file}:${index + 1}: unclosed code fence`)

    const source = body.join('\n')
    const sourceName = `${file}:${index + 1}.${fence.language}`
    const { result, errors } = diagnosticsFor(source, sourceName)
    const isTypeScript = fence.language === 'ts' || fence.language === 'typescript'
    if (isTypeScript && errors.length) throw new Error(`${sourceName}: ${formatDiagnostics(errors)}`)
    const javascript = isTypeScript ? result.outputText.trimEnd() : source
    const typescript = source
    output.push(...pairedBlock(fence.indent, javascript, typescript))
    index = cursor
  }

  const normalized = output.join('\n').replace(/[ \t]+$/gm, '').replaceAll('\t', '  ')
  fs.writeFileSync(file, normalized)
}

function validate(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  const errors = []
  let sourceBlocks = 0
  let pairedBlocks = 0

  for (let index = 0; index < lines.length; index += 1) {
    const fence = fenceAt(lines[index])
    if (!fence) continue
    sourceBlocks += 1

    let tab = ''
    for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
      const trimmed = lines[cursor].trim()
      if (/^=== "(?:JavaScript|TypeScript)"$/.test(trimmed)) {
        tab = trimmed
        break
      }
      if (trimmed.startsWith('```') || /^#{1,6}\s/.test(trimmed) || trimmed === '<!-- cami-language-pair -->') break
    }
    if (!tab) errors.push(`${file}:${index + 1}: source block is not inside a JavaScript/TypeScript tab`)
    else pairedBlocks += 1

    const body = []
    let cursor = index + 1
    while (cursor < lines.length && !/^\s*```\s*$/.test(lines[cursor])) {
      body.push(lines[cursor].slice(fence.indent.length))
      cursor += 1
    }
    const syntaxErrors = syntaxErrorsFor(body.join('\n'), `${file}:${index + 1}.${fence.language}`)
    if (syntaxErrors.length) errors.push(`${file}:${index + 1}: ${formatDiagnostics(syntaxErrors)}`)

  }

  const markerCount = lines.filter((line) => line.trim() === '<!-- cami-language-pair -->').length
  const jsTabCount = lines.filter((line) => line.trim() === '=== "JavaScript"').length
  const tsTabCount = lines.filter((line) => line.trim() === '=== "TypeScript"').length
  if (jsTabCount !== tsTabCount) errors.push(`${file}: ${jsTabCount} JavaScript tabs but ${tsTabCount} TypeScript tabs`)
  if (markerCount !== jsTabCount) errors.push(`${file}: ${markerCount} pair markers but ${jsTabCount} JavaScript tabs`)

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== '<!-- cami-language-pair -->') continue
    const tabs = []
    for (let cursor = index + 1; cursor < lines.length && tabs.length < 2; cursor += 1) {
      const match = lines[cursor].trim().match(/^=== "(JavaScript|TypeScript)"$/)
      if (match) tabs.push(match[1])
      else if (lines[cursor].trim() === '<!-- cami-language-pair -->' || /^#{1,6}\s/.test(lines[cursor].trim())) break
    }
    if (tabs.join(',') !== 'JavaScript,TypeScript') errors.push(`${file}:${index + 1}: language tabs must be ordered JavaScript, then TypeScript`)
  }

  if (file.includes(`${path.sep}learn_by_example${path.sep}`)) {
    const text = lines.join('\n')
    if (!text.includes('class="cami-live-example"')) errors.push(`${file}: worked example has no local Live island`)
    if (/```html[\s\S]*?<script(?![^>]*\bsrc=)[^>]*>\s*\S[\s\S]*?<\/script>[\s\S]*?```/i.test(text)) {
      errors.push(`${file}: worked example still contains inline JavaScript inside an HTML shell`)
    }
  }

  return { errors, sourceBlocks, pairedBlocks, markerCount, jsTabCount, tsTabCount }
}

const files = markdownFiles(docsRoot)
const strictIslands = strictIslandOutputs()
const strictTutorials = strictTutorialErrors()

if (write) {
  if (strictIslands.errors.length) {
    console.error(strictIslands.errors.join('\n'))
    process.exit(1)
  }
  for (const [fileName, output] of strictIslands.outputs) fs.writeFileSync(fileName, output)
  for (const file of files) splitWorkedExample(file)
  for (const file of files) transform(file)
}

const summary = { files: files.length, sourceBlocks: 0, pairedBlocks: 0, pairs: 0 }
const errors = []
errors.push(...strictIslands.errors.map((error) => `Strict island compilation failed: ${error}`))
errors.push(...strictTutorials.map((error) => `Strict tutorial compilation failed: ${error}`))
if (check && !strictIslands.errors.length) {
  for (const [fileName, output] of strictIslands.outputs) {
    if (!fs.existsSync(fileName) || fs.readFileSync(fileName, 'utf8') !== output) {
      errors.push(`${fileName}: generated JavaScript is stale; run npm run docs:examples`)
    }
  }
}
for (const file of files) {
  const result = validate(file)
  errors.push(...result.errors)
  summary.sourceBlocks += result.sourceBlocks
  summary.pairedBlocks += result.pairedBlocks
  summary.pairs += result.jsTabCount
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${summary.pairs} JavaScript/TypeScript pairs (${summary.sourceBlocks} source blocks) across ${summary.files} Markdown files.`)
