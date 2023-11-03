import { readFileSync, writeFileSync } from 'fs';
import { gzipSync } from 'bun';

const files = ['build/cami.module.js', 'build/cami.cdn.js'];

files.forEach(file => {
  const data = readFileSync(file);
  const compressed = gzipSync(data);
  writeFileSync(`${file}.gz`, compressed);
});
