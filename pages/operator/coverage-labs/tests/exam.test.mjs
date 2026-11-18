import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFile(path.join(root,p),'utf8');
const exam=await read('app/exam.html');
test('V0.1.4 exam is linked from learner home and Palisade is identified',async()=>{const home=await read('app/index.html');assert.match(home,/href="exam.html"/);assert.match(home,/Palisade/);assert.match(home,/V0.1.4/)});
test('exam has seven independent work areas and no guided answers',()=>{for(const id of ['assignment','entities','claims','sources','evidence','assessment','report'])assert.match(exam,new RegExp(`id="${id}"`));assert.match(exam,/NO GUIDED HINTS/);assert.equal((exam.match(/data-reviewed=/g)||[]).length,7);assert.doesNotMatch(exam,/Expected findings|answer key|correct answer/i)});
test('Palisade source desk exposes eleven source PDFs and registers',async()=>{const desk=await read('app/research-lab/palisade/research/desk.html');assert.equal((desk.match(/class="source-card"/g)||[]).length,0);assert.equal((desk.match(/href="\.\.\/Sources\//g)||[]).length,11);for(const f of ['CLAIMS.csv','SOURCES.csv'])await fs.access(path.join(root,'app/research-lab/palisade/research',f))});
test('Palisade website, wiki, institution pages and all source PDFs exist',async()=>{for(const p of ['app/research-lab/palisade/website/index.html','app/research-lab/palisade/wiki/index.html','app/research-lab/palisade/research/desk.html','app/research-lab/institutions/atlas-registry/index.html','app/research-lab/institutions/regional-access-office/index.html'])await fs.access(path.join(root,p));const dir=path.join(root,'app/research-lab/palisade/Sources');const files=(await fs.readdir(dir)).filter(x=>x.endsWith('.pdf'));assert.equal(files.length,11)});
test('exam workspace saves locally and supports JSON export',()=>{assert.match(exam,/localStorage/);assert.match(exam,/palisade-exam-notes\.json/);assert.match(exam,/data-field/);assert.match(exam,/data-check/)});
test('facilitator guide is outside learner app',async()=>{await fs.access(path.join(root,'facilitator-only/PALISADE_EXAM_GUIDE.md'));assert.ok(!(await fs.readdir(path.join(root,'app'))).includes('facilitator-only'));assert.doesNotMatch(exam,/PALISADE_EXAM_GUIDE|Expected claim assessments/)});
test('package version and roadmap identify V0.1.4',async()=>{const p=JSON.parse(await read('package.json'));assert.equal(p.version.split('+')[0],'0.1.4');const r=await read('ROADMAP.md');assert.match(r,/V0\.1\.4 — Independent Exam Experience/);assert.doesNotMatch(r,/\| Day \|/) });

test('V0.1.4.1.1 Palisade witchy pastel-green and purple-goth palette is consistent',async()=>{
 const css=await read('app/research-lab/palisade/website/brand.css');
 const wiki=await read('app/research-lab/palisade/wiki/index.html');
 const desk=await read('app/research-lab/palisade/research/desk.html');
 const home=await read('app/index.html');
 const readme=await read('app/research-lab/palisade/README.md');
 for(const token of ['#24192d','#76518b','#a98bc2','#b9d5ad','#dcebd5','#e5d9ed'])assert.ok(css.includes(token),`Missing palette token ${token}`);
 for(const page of [wiki,desk])assert.ok(page.includes('#76518b')||page.includes('#b9d5ad'), 'Palisade surface is missing the new palette');
 assert.match(home,/PUBLIC SIMULATION/);
 assert.match(readme,/witchy pastel sage green/i);
 assert.doesNotMatch(css,/#17233f|#2855c5|#e96b3a|#e9c94a|#77834c|#f7f0de/i);
});
