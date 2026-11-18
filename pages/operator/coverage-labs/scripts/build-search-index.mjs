import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
const ROOT = path.resolve(fileURLToPath(new URL('../app/', import.meta.url)));
const OUT = path.join(ROOT, 'search', 'search-index.json');
const EXTS = new Set(['.html','.md','.csv','.pdf','.txt']);
const walk = async dir => (await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(async d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)]))).flat();
const strip = s => s.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const entries=[];
for (const file of await walk(ROOT)) {
  const ext=path.extname(file).toLowerCase(); if(!EXTS.has(ext)) continue;
  const rel=path.relative(ROOT,file).split(path.sep).join('/');
  if(rel==='search/search-index.json' || rel.startsWith('goedgeregeld/')) continue;
  let raw='', title=path.basename(file), type=ext.slice(1);
  try {
    if(ext==='.pdf') { const {stdout}=await execFileAsync('pdftotext',['-layout',file,'-'],{maxBuffer:8*1024*1024}); raw=stdout; const first=raw.split(/\n/).map(x=>x.trim()).find(x=>x.length>8&&!/^PUBLIC RECORD|^EXTERNAL SOURCE|^SIMULATION/i.test(x)); if(first) title=first.slice(0,120); }
    else { raw=await fs.readFile(file,'utf8'); if(ext==='.html'){title=raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g,'').trim()||title; raw=strip(raw);} }
  } catch { continue; }
  const body=raw.slice(0,24000);
  entries.push({id:rel.replace(/[^a-z0-9]+/gi,'-').toLowerCase(),title,url:'/'+rel,type,body,terms:(title+' '+body).toLowerCase().split(/[^\p{L}\p{N}-]+/u).filter(x=>x.length>2).slice(0,6000)});
}
entries.sort((a,b)=>a.url.localeCompare(b.url));
await fs.writeFile(OUT,JSON.stringify({generatedAt:new Date().toISOString(),count:entries.length,entries},null,2));
console.log(`Indexed ${entries.length} local documents into ${path.relative(ROOT,OUT)}`);
