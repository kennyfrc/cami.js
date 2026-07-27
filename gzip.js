import { gzipSync } from "bun";
import { readFileSync, writeFileSync } from "fs";

const files = ["build/cami.module.js", "build/cami.cdn.js"];
const gzippedFiles = [];

files.forEach((file) => {
    const data = readFileSync(file);
    const compressed = gzipSync(data);
    const gzippedFile = `${file}.gz`;
    writeFileSync(gzippedFile, compressed);
    gzippedFiles.push(gzippedFile);
});

console.log("Gzipped files:", gzippedFiles);
