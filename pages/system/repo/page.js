/* GitHub viewer — reads a public repo through api.github.com and renders it natively (GitHub itself can't be framed). */
(function () {
  'use strict';
  const { el, esc, icon } = VS, API = 'https://api.github.com', out = document.getElementById('repo-out'), input = document.getElementById('repo-in');
  document.getElementById('repo-ic').innerHTML = icon('github', 20);
  let repo = '', info = null, dir = '';
  const store = { get: () => { try { return localStorage.getItem('vs.repo') || ''; } catch { return ''; } }, set: v => { try { localStorage.setItem('vs.repo', v); } catch { } } };
  const guess = () => { const h = location.hostname; if (!h.endsWith('.github.io')) return ''; const o = h.split('.')[0], seg = location.pathname.split('/').filter(Boolean)[0]; return seg && seg !== 'pages' ? `${o}/${seg}` : `${o}/${o}.github.io`; };
  const ago = d => { const s = (Date.now() - new Date(d)) / 1000; for (const [n, u] of [[31536000, 'y'], [2592000, 'mo'], [86400, 'd'], [3600, 'h'], [60, 'm']]) if (s >= n) return Math.floor(s / n) + u + ' ago'; return 'just now'; };
  const kb = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : n > 1024 ? Math.round(n / 1024) + ' KB' : n + ' B';

  async function gh(url, raw) {
    const k = 'vs.gh:' + url + (raw ? ':r' : '');
    try { const c = JSON.parse(sessionStorage.getItem(k)); if (c && Date.now() - c.t < 6e5) return c.d; } catch { }
    const r = await fetch(url, { headers: { Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json' } });
    if (!r.ok) { const e = new Error(r.status === 403 || r.status === 429 ? 'GitHub rate limit reached — try again in a while (60 requests/hour without sign-in).' : r.status === 404 ? 'Repository not found — is it public, and is the name right?' : 'GitHub returned ' + r.status); e.status = r.status; throw e; }
    const d = raw ? await r.text() : await r.json(); try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch { } return d;
  }
  const note = (tone, title, text) => VS.blocks.render([{ type: 'callout', tone, title, text }], out);

  async function load(force) {
    out.innerHTML = ''; info = null; dir = '';
    if (force) try { Object.keys(sessionStorage).filter(k => k.startsWith('vs.gh:')).forEach(k => sessionStorage.removeItem(k)); } catch { }
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) { await note('info', 'Which repository?', 'Type `owner/name` above (for example `torvalds/linux`). To make it permanent, set `"github": "owner/name"` in `viewscape.config.json`. On GitHub Pages it is detected automatically.'); return; }
    input.value = repo; out.append(el('p', { class: 'vs-cap', text: 'contacting github…' }));
    try {
      const [i, rd, cm] = await Promise.all([gh(`${API}/repos/${repo}`), gh(`${API}/repos/${repo}/readme`, true).catch(() => null), gh(`${API}/repos/${repo}/commits?per_page=8`).catch(() => [])]);
      info = i; out.innerHTML = ''; await draw(rd, cm);
    } catch (e) { out.innerHTML = ''; await note('hot', 'Could not load', e.message); }
  }

  async function draw(readme, commits) {
    const meta = el('div', { class: 'repo-meta' }); out.append(meta);
    meta.append(el('p', { class: 'repo-desc', text: info.description || info.full_name }));
    const sh = el('div'); meta.append(sh);
    await VS.blocks.render([{ type: 'stats', items: [
      { label: 'Stars', value: info.stargazers_count, icon: 'star' }, { label: 'Forks', value: info.forks_count, icon: 'layers' },
      { label: 'Open issues', value: info.open_issues_count, icon: 'info' }, { label: 'Updated', value: ago(info.pushed_at), icon: 'zap', note: info.language || '' }] }], sh);
    const tabs = el('div', { class: 'repo-tabs' }), panes = {};
    const mk = (id, label, ic) => { const b = el('button', { class: 'vs-chip', html: icon(ic, 16) + label, onclick: () => pick(id) }); tabs.append(b); panes[id] = { b, p: el('div', { class: 'repo-pane' }) }; };
    mk('readme', 'README', 'book'); mk('files', 'Files', 'layers'); mk('commits', 'Commits', 'zap');
    out.append(tabs, ...Object.values(panes).map(x => x.p));
    const pick = id => Object.entries(panes).forEach(([k, x]) => { x.b.classList.toggle('on', k === id); x.p.classList.toggle('on', k === id); });
    // README
    const rm = panes.readme.p;
    if (readme) {
      const clean = readme.replace(/<!--[\s\S]*?-->/g, '').replace(/<\/?(p|div|br|img|a|picture|source|details|summary|h[1-6]|b|i|center|sup|sub|kbd|span|table|tr|td|th|tbody|thead)\b[^>]*>/gi, '');
      rm.append(el('div', { class: 'vs-glass repo-readme vs-prose', html: VS.md.block(clean, { base: `https://raw.githubusercontent.com/${repo}/${info.default_branch}/` }) }));
    } else rm.append(el('p', { class: 'vs-cap', text: 'This repository has no README.' }));
    // commits
    const cl = el('ul', { class: 'repo-commits' });
    (commits || []).forEach(c => cl.append(el('li', {}, el('b', { text: (c.commit.message || '').split('\n')[0] }), el('small', { text: `${c.commit.author.name} · ${ago(c.commit.author.date)} · ${c.sha.slice(0, 7)}` }))));
    panes.commits.p.append(commits && commits.length ? cl : el('p', { class: 'vs-cap', text: 'No commits to show.' }));
    // files
    const fp = panes.files.p; async function list(path) {
      dir = path; fp.innerHTML = '';
      const parts = path ? path.split('/') : [];
      fp.append(el('div', { class: 'repo-crumbs' }, el('button', { text: info.name, onclick: () => list('') }), ...parts.flatMap((p, i) => ['/', el('button', { text: p, onclick: () => list(parts.slice(0, i + 1).join('/')) })])));
      const ul = el('ul', { class: 'repo-list' }); fp.append(ul);
      try {
        const items = await gh(`${API}/repos/${repo}/contents/${path}?ref=${info.default_branch}`);
        items.sort((a, b) => (a.type === 'dir' ? 0 : 1) - (b.type === 'dir' ? 0 : 1) || a.name.localeCompare(b.name));
        items.forEach(f => ul.append(el('li', {}, el('button', { onclick: () => (f.type === 'dir' ? list(f.path) : view(f)), html: icon(f.type === 'dir' ? 'layers' : /\.(md|txt)$/i.test(f.name) ? 'book' : 'code', 18) + `<span class="nm">${esc(f.name)}${f.type === 'dir' ? '/' : ''}</span>` + (f.type === 'file' ? `<span class="sz">${kb(f.size)}</span>` : '') }))));
      } catch (e) { fp.append(el('p', { class: 'vs-cap', text: e.message })); }
    }
    async function view(f) {
      let v = fp.querySelector('.repo-view'); if (v) v.remove(); v = el('div', { class: 'vs-glass repo-view' }); fp.append(v);
      const head = el('header', {}, el('b', { text: f.path }), el('a', { class: 'vs-btn ghost sm', href: f.html_url, target: '_blank', rel: 'noopener', text: 'Open on GitHub ↗' })); v.append(head);
      v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(f.name)) return v.append(el('img', { src: f.download_url, alt: f.name }));
      if (f.size > 200000 || !/\.(md|markdown|txt|json|js|mjs|css|html?|ya?ml|xml|csv|webmanifest|sh|py|toml|cfg|ini|gitignore|nojekyll)$|^[^.]+$/i.test(f.name)) return v.append(el('p', { class: 'vs-cap', text: 'Too large or not a text file — open it on GitHub.' }));
      try {
        const t = await gh(`${API}/repos/${repo}/contents/${f.path}?ref=${info.default_branch}`, true);
        if (/\.(md|markdown)$/i.test(f.name)) v.append(el('div', { class: 'vs-prose', html: VS.md.block(t, { base: `https://raw.githubusercontent.com/${repo}/${info.default_branch}/${f.path.replace(/[^/]*$/, '')}` }) }));
        else v.append(el('pre', { class: 'vs-code' }, el('code', { text: t })));
      } catch (e) { v.append(el('p', { class: 'vs-cap', text: e.message })); }
    }
    list(''); pick('readme');
  }

  /* wiring */
  document.getElementById('repo-form').addEventListener('submit', e => { e.preventDefault(); repo = input.value.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$|\/$/g, ''); store.set(repo); load(); });
  const openGH = () => window.open(`https://github.com/${repo || ''}`, '_blank', 'noopener');
  document.getElementById('repo-open').onclick = openGH;
  document.addEventListener('repo:open', openGH); document.addEventListener('repo:refresh', () => load(true)); document.addEventListener('repo:focus', () => input.focus());
  (async () => { const cfg = await VS.config().catch(() => ({})); repo = store.get() || cfg.github || guess(); load(); })();
})();
