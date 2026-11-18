import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const companies = ['noordlicht', 'rivierzorg', 'kompas'];

test('each fictional company has a finished research workspace', async () => {
  for (const slug of companies) {
    const base = path.join(root, 'research-lab', slug);
    for (const file of [
      'website/index.html', 'wiki/index.html', 'wiki/Wiki.md',
      'research/overview.html', 'research/parent.html', 'research/provider.html',
      'research/policy.html', 'research/evidence.html', 'research/Parent_Research.md',
      'research/Provider_Research.md', 'research/Policy_Research.md',
      'research/Claims_Register.csv', 'research/Sources_Register.csv'
    ]) {
      await fs.access(path.join(base, file));
    }
    const sourceFiles = (await fs.readdir(path.join(base, 'Sources'))).filter(f => f.endsWith('.pdf'));
    assert.equal(sourceFiles.length, 10, `${slug} should have 10 source PDFs`);
  }
});

test('public casebook does not link facilitator answer key', async () => {
  const files = [
    'index.html',
    'research-lab/casebook/index.html',
    'research-lab/casebook/shared-case.html',
    ...companies.flatMap(c => [
      `research-lab/${c}/website/index.html`,
      `research-lab/${c}/wiki/index.html`,
      `research-lab/${c}/research/overview.html`
    ])
  ];
  for (const rel of files) {
    const html = await fs.readFile(path.join(root, rel), 'utf8');
    assert.equal(html.includes('FACILITATOR_ONLY/ANSWER_KEY.md'), false, `${rel} must not reveal the answer key path`);
  }
});

test('simulated external institutions are explicitly labelled', async () => {
  const html = await fs.readFile(path.join(root, 'research-lab/institutions/index.html'), 'utf8');
  assert.match(html, /FICTIONAL SOURCE ECOSYSTEM/i);
  const readme = await fs.readFile(path.join(root, 'research-lab/institutions/README.md'), 'utf8');
  assert.match(readme, /All institutions and documents below are fictional/i);
});

test('each company has three 2027 products and finished dossier examples', async () => {
  for (const slug of companies) {
    const base = path.join(root, 'research-lab', slug);
    const policy = await fs.readFile(path.join(base, 'research/Policy_Research.md'), 'utf8');
    assert.equal((policy.match(/^### /gm) || []).length, 3, `${slug} should document three products`);
    for (const page of ['parent.html', 'provider.html', 'policy.html', 'evidence.html']) {
      const html = await fs.readFile(path.join(base, 'research', page), 'utf8');
      assert.match(html, /Fictional source environment/i, `${slug}/${page} must state simulation status`);
    }
    const sourceRegister = await fs.readFile(path.join(base, 'research/Sources_Register.csv'), 'utf8');
    assert.match(sourceRegister, new RegExp(slug.toUpperCase().replace('NOORDLICHT','NOORDLICHT').replace('RIVIERZORG','RIVIERZORG').replace('KOMPAS','KOMPAS') + '-SRC-001'));
  }
});

test('facilitator solutions exist outside the learner-facing interface', async () => {
  const answerKey = await fs.readFile(path.join(root, 'FACILITATOR_ONLY/ANSWER_KEY.md'), 'utf8');
  const clueMap = await fs.readFile(path.join(root, 'FACILITATOR_ONLY/CLUE_MAP.csv'), 'utf8');
  assert.match(answerKey, /FACILITATOR ONLY/i);
  assert.match(clueMap, /clue_id|source_id/i);
  const publicCasebook = await fs.readFile(path.join(root, 'research-lab/casebook/index.html'), 'utf8');
  assert.doesNotMatch(publicCasebook, /ANSWER_KEY|CLUE_MAP/i);
});

test('company source styles and external source archive remain distinct', async () => {
  const styles = {};
  for (const slug of companies) {
    styles[slug] = await fs.readFile(path.join(root, `research-lab/${slug}/website/brand.css`), 'utf8');
  }
  assert.notEqual(styles.noordlicht, styles.rivierzorg);
  assert.notEqual(styles.rivierzorg, styles.kompas);
  assert.match(styles.rivierzorg, /dark|theme/i);
  const institutionPdfs = (await fs.readdir(path.join(root, 'research-lab/institutions/Sources'))).filter(f => f.endsWith('.pdf'));
  assert.equal(institutionPdfs.length, 6);
});
