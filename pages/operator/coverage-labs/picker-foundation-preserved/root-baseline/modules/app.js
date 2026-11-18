const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function load(name) {
  const response = await fetch(`data/${name}/index.json`);
  if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
  return response.json();
}
function renderRows(items, columns) {
  if (!items.length) return '<p class="muted">No records entered. Unknown information is not treated as a negative finding.</p>';
  return `<div class="table-wrap"><table><thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead><tbody>${items.map(item=>`<tr>${columns.map(c=>`<td>${escapeHtml(c.value(item))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
async function start() {
  try {
    const [groups, providers, policies, claims, sources] = await Promise.all(['groups','providers','policies','claims','sources'].map(load));
    $('#status').textContent = 'Data loaded';
    $('#counts').innerHTML = [['Groups',groups],['Providers',providers],['Policies',policies],['Claims',claims],['Sources',sources]].map(([n,v])=>`<article class="stat"><strong>${v.length}</strong><span>${n}</span></article>`).join('');
    $('#groups').innerHTML = renderRows(groups,[{label:'Group',value:x=>x.name},{label:'Verification',value:x=>x.verification_status},{label:'Legal entity',value:x=>x.legal_entity ?? 'Unknown'},{label:'Assessment',value:x=>x.assessment.rating ?? 'Unknown'}]);
    $('#providers').innerHTML = renderRows(providers,[{label:'Provider',value:x=>x.name},{label:'Group ID',value:x=>x.group_id},{label:'Legal insurer',value:x=>x.legal_insurer ?? 'Unknown'},{label:'Verification',value:x=>x.verification_status}]);
    $('#policies').innerHTML = renderRows(policies,[{label:'Policy',value:x=>x.name},{label:'Year',value:x=>x.policy_year},{label:'Provider ID',value:x=>x.provider_id},{label:'Monthly premium',value:x=>x.monthly_premium_eur == null ? 'Unknown' : `€${x.monthly_premium_eur}`}]);
    $('#evidence').innerHTML = `<p>${claims.length} claims and ${sources.length} sources currently recorded.</p>`;
  } catch (error) {
    $('#status').textContent = 'Could not load data';
    $('#error').hidden = false; $('#error').textContent = `${error.message}. Start the local server with npm run serve.`;
  }
}
start();
