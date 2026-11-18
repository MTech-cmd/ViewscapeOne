import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.join(root, 'app');
const home = await fs.readFile(path.join(app, 'index.html'), 'utf8');

test('independent project identity and learner entry point exist', async () => {
  const [readme, project, roadmap] = await Promise.all([
    fs.readFile(path.join(root, 'README.md'), 'utf8'),
    fs.readFile(path.join(root, 'PROJECT.md'), 'utf8'),
    fs.readFile(path.join(root, 'ROADMAP.md'), 'utf8')
  ]);
  assert.match(readme, /Coverage Labs/);
  assert.match(project, /investigative journalism training playground/i);
  assert.match(roadmap, /Operator.*playthrough/i);
  assert.match(home, /Coverage Labs — Open Investigation Playground/);
  assert.match(home, /OPEN INVESTIGATIVE JOURNALISM PLAYGROUND/);
});

test('public home offers Tutorial, Academy, Exam and open browsing without a prescribed journey', () => {
  for (const phrase of ['Tutorial','Academy','Exam','Browse VINDR','FREQUENCY worked example']) assert.ok(home.includes(phrase), `Missing entry: ${phrase}`);
  assert.match(home,/goedgeregeld\/index\.html/);
  assert.doesNotMatch(home,/THE JOURNEY|A ROUTE THROUGH THE LAB|journey-section/i);
  assert.match(home,/V0\.1\.4\.6/);
});

test('three existing company worlds remain and the former Casebook is retired from the learner app', async () => {
  for (const company of ['noordlicht', 'rivierzorg', 'kompas']) {
    await fs.access(path.join(app, 'research-lab', company, 'website', 'index.html'));
    await fs.access(path.join(app, 'research-lab', company, 'wiki', 'index.html'));
    await fs.access(path.join(app, 'research-lab', company, 'research', 'overview.html'));
    assert.ok(home.includes(`research-lab/${company}/website/index.html`));
    assert.ok(home.includes(`research-lab/${company}/wiki/index.html`));
  }
  await fs.access(path.join(root, 'facilitator-only', 'legacy-casebook-archive', 'shared-case.html'));
  assert.ok(!(await fs.readdir(path.join(app, 'research-lab'))).includes('casebook'));
  await fs.access(path.join(app, 'research-lab', 'institutions', 'index.html'));
});

test('facilitator materials and Picker foundation are outside the learner app', async () => {
  await fs.access(path.join(root, 'facilitator-only', 'ANSWER_KEY.md'));
  await fs.access(path.join(root, 'facilitator-only', 'CLUE_MAP.csv'));
  await fs.access(path.join(root, 'picker-foundation-preserved', 'foundation', 'index.html'));
  await fs.access(path.join(root, 'picker-foundation-preserved', 'foundation', 'data', 'groups', 'index.json'));
  assert.doesNotMatch(home, /ANSWER_KEY|CLUE_MAP|facilitator-only|picker-foundation-preserved/i);
});

test('learner home includes responsive and reduced-motion stylesheet rules', async () => {
  const css = await fs.readFile(path.join(app, 'styles.css'), 'utf8');
  assert.match(home, /name="viewport"/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /overflow-x:\s*hidden/);
});

test('no Git history or Picker runtime was copied into the independent learner app', async () => {
  const entries = await fs.readdir(app);
  assert.ok(!entries.includes('.git'));
  assert.ok(!entries.includes('data'));
  assert.ok(!entries.includes('schemas'));
  assert.ok(!entries.includes('modules'));
});
