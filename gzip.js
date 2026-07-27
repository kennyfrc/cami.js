import { readFileSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const files = ['build/cami.module.js', 'build/cami.cdn.js']
const gzippedFiles = []

files.forEach(file => {
  const data = readFileSync(file)
  const compressed = gzipSync(data)
  const gzippedFile = `${file}.gz`
  writeFileSync(gzippedFile, compressed)
  gzippedFiles.push(gzippedFile)
})

console.log('Gzipped files:', gzippedFiles)
