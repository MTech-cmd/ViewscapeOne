import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','app');
const files=[];const directories=['/','/workspace/'];
async function walk(dir){for(const ent of await fs.readdir(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory()){try{await fs.access(path.join(full,'index.html'));directories.push('/'+path.relative(root,full).split(path.sep).join('/')+'/');}catch{}await walk(full);}else if(!['sw.js','precache-manifest.json'].includes(ent.name))files.push('/'+path.relative(root,full).split(path.sep).join('/'));}}
await walk(root);
files.push(...directories);
await fs.writeFile(path.join(root,'precache-manifest.json'),JSON.stringify([...new Set(files)].sort(),null,2)+'\n');
console.log(`Prepared offline cache manifest: ${new Set(files).size} unique paths; facilitator-only material is outside app/ and excluded.`);
