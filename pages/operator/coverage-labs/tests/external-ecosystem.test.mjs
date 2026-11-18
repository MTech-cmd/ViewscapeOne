import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const APP=path.join(ROOT,'app');
const read=rel=>fs.readFile(path.join(ROOT,rel),'utf8');
const walk=async dir=>(await Promise.all((await fs.readdir(dir,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();

test('V0.1.4.6 landing, sources and archived Academy casebook refinement',async()=>{
 const pkg=JSON.parse(await read('package.json')); const project=await read('PROJECT.md'); const roadmap=await read('ROADMAP.md');
 assert.equal(pkg.version,'0.1.4+milestone.6'); assert.match(project,/V0\.1\.4\.6 — Landing, Sources & Academy Casebook Refinement/); assert.match(roadmap,/V0\.1\.4\.6 — Landing, Sources & Academy Casebook Refinement/);
});

test('VINDR index covers local pages and source documents',async()=>{
 const index=JSON.parse(await fs.readFile(path.join(APP,'search/search-index.json'),'utf8'));
 assert.ok(index.count>100); assert.ok(index.entries.some(x=>x.url==='/index.html'));
 assert.ok(index.entries.some(x=>x.url==='/wiki/index.html'));
 assert.ok(index.entries.some(x=>x.url.endsWith('.pdf')&&x.url.includes('NCB-2026-12')));
 assert.ok(index.entries.some(x=>x.url.endsWith('.csv')));
 const html=(await walk(APP)).filter(x=>x.endsWith('.html'));
 const indexed=new Set(index.entries.map(x=>x.url));
 for(const f of html){const rel='/'+path.relative(APP,f).split(path.sep).join('/');if(rel.startsWith('/goedgeregeld/'))assert.ok(!indexed.has(rel),`GoedGeregeld must remain ad-discovered only: ${rel}`);else assert.ok(indexed.has(rel),`Missing from search index: ${rel}`);}
});

test('VINDR search interface has sponsored simulation labels and no external service dependency',async()=>{
 const html=await read('app/search/index.html'); const js=await read('app/search/search.js');
 assert.match(html,/VINDR/); assert.match(html,/Advertentie/); assert.match(js,/Advertentie · gesponsord/); assert.match(js,/goedgeregeld\/index\.html/); assert.match(js,/search-index\.json/);
 assert.doesNotMatch(js,/https?:\/\//);
 new vm.Script(js);
});

test('KennisKade articles all cite known local source IDs and support local editing',async()=>{
 const articles=JSON.parse(await fs.readFile(path.join(APP,'wiki/articles.json'),'utf8'));
 const sources=JSON.parse(await fs.readFile(path.join(APP,'wiki/sources.json'),'utf8'));
 const ids=new Set(sources.map(x=>x.id)); assert.ok(articles.length>=7); assert.ok(sources.length>=30);
 for(const a of articles){assert.ok(a.sources.length,`${a.id} has no sources`);for(const id of a.sources)assert.ok(ids.has(id),`${a.id} cites unknown ${id}`);const page=await fs.readFile(path.join(APP,'wiki/articles',a.id+'.html'),'utf8');assert.match(page,/Bewerk dit artikel/);assert.match(page,/localStorage/);assert.match(page,/Onbekende bron-ID/);}
});

test('KennisKade inline editor scripts compile',async()=>{
 const files=(await walk(path.join(APP,'wiki/articles'))).filter(x=>x.endsWith('.html'));
 for(const file of files){const html=await fs.readFile(file,'utf8');const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];assert.ok(scripts.length,`No editor script in ${file}`);for(const [,src] of scripts)new vm.Script(src,{filename:file});}
});

test('external institution archive includes expanded multi-page PDFs',async()=>{
 const src=path.join(APP,'research-lab/institutions/Sources');
 const names=await fs.readdir(src); const expected=['NCB-2026-12','NCB-2026-31','KRO-2026-052','DBR-2026-204','NZT-2026-19','NZT-2026-27','ZORGLIJN-2026-58','ZORGLIJN-2026-63','CIVIC-2026-29','ATLAS-2026-88','WAO-2026-17'];
 for(const id of expected){const name=names.find(n=>n.startsWith(id));assert.ok(name,`Missing ${id}`);const info=execFileSync('pdfinfo',[path.join(src,name)],{encoding:'utf8'});const pages=Number(info.match(/Pages:\s+(\d+)/)?.[1]||0);assert.ok(pages>=2,`${id} should be multi-page`);}
});

test('institution directory links all distinct portals and archive pages',async()=>{
 const html=await read('app/research-lab/institutions/index.html');
 for(const slug of ['noorderbank','kro','dbr','nzt','zorglijn','civic-lens','atlas-registry','regional-access-office','signal-desk','wetering-civic-capital','noordzee-energy','atlas-civic-fund','delta-grid','van-wetering-family','north-quay-terminal','meridian-north-sea-energy'])assert.match(html,new RegExp(slug+'/index\\.html'));
 const files=await walk(path.join(APP,'research-lab/institutions'));
 for(const slug of ['noorderbank','kro','dbr','nzt','zorglijn','civic-lens','atlas-registry','regional-access-office'])assert.ok(files.some(f=>f.includes(path.sep+slug+path.sep)&&f.endsWith('.html')));
});

test('facilitator material remains outside the served app',async()=>{
 const appFiles=await walk(APP); assert.ok(!appFiles.some(f=>f.toLowerCase().includes('facilitator')));
 const guide=await fs.stat(path.join(ROOT,'facilitator-only/PALISADE_EXAM_GUIDE.md')); assert.ok(guide.isFile());
});

test('public deployment routing works beneath an arbitrary /app/ prefix',async()=>{
 const home=await read('app/index.html'); const archive=await read('app/research-lab/institutions/noorderbank/archive.html'); const sw=await read('app/sw.js'); const server=await read('server.mjs');
 assert.match(home,/coverage-path-resolver/); assert.match(archive,/coverage-path-resolver/);
 assert.match(home,/coveragePath\("sw\.js"\)/); assert.match(sw,/self\.registration\.scope/); assert.match(server,/indexOf\('\/app\/'\)/);
 const manifest=JSON.parse(await read('app/manifest.webmanifest')); assert.equal(manifest.scope,'./'); assert.equal(manifest.start_url,'./workspace/');
});

test('all six insurer worlds have visible brand logo assets',async()=>{
 for(const slug of ['noordlicht','rivierzorg','kompas','solstice','frequency','palisade']){
  const logo=await fs.readFile(path.join(APP,`research-lab/${slug}/website/logo.svg`),'utf8'); assert.match(logo,/<svg/);
  const page=await fs.readFile(path.join(APP,`research-lab/${slug}/website/index.html`),'utf8'); assert.match(page,/logo\.svg/);
 }
});

test('GoedGeregeld is a satirical ad-discovered side world, not a search destination',async()=>{
 const home=await read('app/index.html'); assert.match(home,/SPONSORED/); assert.match(home,/goedgeregeld\/index\.html/);
 const index=JSON.parse(await fs.readFile(path.join(APP,'search/search-index.json'),'utf8')); assert.ok(!index.entries.some(x=>x.url.startsWith('/goedgeregeld/')));
 const files=(await walk(path.join(APP,'goedgeregeld'))).filter(x=>x.endsWith('.html')); assert.ok(files.length>=20);
 const wiki=await read('app/goedgeregeld/wiki/index.html'); const history=await read('app/goedgeregeld/history/index.html'); assert.match(wiki,/Evidence use and limitations/); assert.match(history,/2027 — Assurance catalogue/); assert.ok(files.length>=40);
});

test('expanded ecosystem gives every new institution a website, wiki, source archive and VINDR presence',async()=>{
 const slugs=['wetering-civic-capital','noordzee-energy','atlas-civic-fund','delta-grid','van-wetering-family','north-quay-terminal','meridian-north-sea-energy'];
 const index=JSON.parse(await fs.readFile(path.join(APP,'search/search-index.json'),'utf8'));
 for(const slug of slugs){
  for(const file of ['assets/logo.svg','website/index.html','wiki/index.html','documents/annual-note.html','documents/ownership-and-interest-register.html','documents/capital-and-contracts.html']) await fs.access(path.join(APP,'research-lab/institutions',slug,file));
  assert.ok(index.entries.some(x=>x.url.includes(`/institutions/${slug}/wiki/`)),`VINDR missing ${slug}`);
 }
 const meridian=await read('app/research-lab/institutions/meridian-north-sea-energy/wiki/index.html');
 assert.match(meridian,/MNSE/); assert.match(meridian,/€18\.40/);
});

test('GoedGeregeld deployments are documented for five insurers while Kompas remains independent',async()=>{
 for(const id of ['GG-CUST-117','GG-CUST-118','GG-CUST-122','GG-CUST-123','GG-CUST-124']) await fs.access(path.join(APP,'goedgeregeld/documents',id.toLowerCase()+'.html'));
 const kompas=await read('app/research-lab/kompas/research/kompas-independent-stack.html');
 assert.match(kompas,/declined the proposed GoedGeregeld enterprise deployment/);
 for(const p of await walk(path.join(APP,'research-lab/kompas'))){if(!p.endsWith('.html'))continue;const t=await fs.readFile(p,'utf8');assert.doesNotMatch(t,/gg-inline-ad/);}
});

test('GoedGeregeld source archive is reachable through sponsored placements and excluded from ordinary VINDR results',async()=>{
 const search=await read('app/search/search.js'); assert.match(search,/goedgeregeld\/index\.html/);
 const home=await read('app/index.html'); assert.match(home,/goedgeregeld\/index\.html/);
 const index=JSON.parse(await fs.readFile(path.join(APP,'search/search-index.json'),'utf8'));assert.ok(!index.entries.some(x=>x.url.startsWith('/goedgeregeld/')));
 const docs=(await walk(path.join(APP,'goedgeregeld/documents'))).filter(x=>x.endsWith('.html'));assert.ok(docs.length>=40);
});
