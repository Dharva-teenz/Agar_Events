import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(['node_modules','dist','preview','.git'].includes(entry.name))continue;const p=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(p));else if(/\.(js|mjs)$/.test(p))files.push(p);}return files;}
const files=await walk(root);let failures=0;
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status){console.error(result.stderr);failures++;}}
console.log(`JavaScript syntax: ${files.length-failures}/${files.length} passed.`);
console.log('Run npm run build to validate JSX and the full Vite dependency graph.');
process.exitCode=failures?1:0;
