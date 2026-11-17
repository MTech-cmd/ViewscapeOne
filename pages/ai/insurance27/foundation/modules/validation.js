import fs from 'node:fs/promises';
import path from 'node:path';

const DATA = path.resolve('data');
export async function loadDataset(base = DATA) {
  const read = async (name) => JSON.parse(await fs.readFile(path.join(base, name, 'index.json'), 'utf8'));
  return { groups: await read('groups'), providers: await read('providers'), policies: await read('policies'), claims: await read('claims'), sources: await read('sources') };
}

function issue(errors, code, message) { errors.push({ code, message }); }
function uniqueIds(items, key, label, errors) {
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item[key] !== 'string' || !item[key].trim()) { issue(errors, 'MISSING_ID', `${label} record has no ${key}.`); continue; }
    if (seen.has(item[key])) issue(errors, 'DUPLICATE_ID', `Duplicate ${label} identifier: ${item[key]}`);
    seen.add(item[key]);
  }
  return seen;
}
function checkRefs(items, field, valid, label, errors) {
  for (const item of items) for (const ref of item[field] ?? []) if (!valid.has(ref)) issue(errors, 'BROKEN_REFERENCE', `${label} ${item.group_id ?? item.provider_id ?? item.claim_id ?? item.source_id} references missing ${field} target ${ref}.`);
}

export function validateDataset(data) {
  const errors = [];
  const groupIds = uniqueIds(data.groups, 'group_id', 'group', errors);
  const providerIds = uniqueIds(data.providers, 'provider_id', 'provider', errors);
  const policyIds = uniqueIds(data.policies, 'policy_id', 'policy', errors);
  const claimIds = uniqueIds(data.claims, 'claim_id', 'claim', errors);
  const sourceIds = uniqueIds(data.sources, 'source_id', 'source', errors);

  for (const p of data.providers) if (!groupIds.has(p.group_id)) issue(errors, 'BROKEN_GROUP', `Provider ${p.provider_id} references missing group ${p.group_id}.`);
  for (const p of data.policies) if (!providerIds.has(p.provider_id)) issue(errors, 'BROKEN_PROVIDER', `Policy ${p.policy_id} references missing provider ${p.provider_id}.`);
  for (const g of data.groups) checkRefs([g], 'provider_ids', providerIds, 'Group', errors);
  for (const p of data.providers) checkRefs([p], 'policy_ids', policyIds, 'Provider', errors);
  for (const p of data.policies) checkRefs([p], 'claim_ids', claimIds, 'Policy', errors);
  for (const c of data.claims) {
    if (c.entity_level === 'group' && !groupIds.has(c.entity_id)) issue(errors, 'BROKEN_CLAIM_ENTITY', `Claim ${c.claim_id} references missing group ${c.entity_id}.`);
    if (c.entity_level === 'provider' && !providerIds.has(c.entity_id)) issue(errors, 'BROKEN_CLAIM_ENTITY', `Claim ${c.claim_id} references missing provider ${c.entity_id}.`);
    if (c.entity_level === 'policy' && !policyIds.has(c.entity_id)) issue(errors, 'BROKEN_CLAIM_ENTITY', `Claim ${c.claim_id} references missing policy ${c.entity_id}.`);
    checkRefs([c], 'source_ids', sourceIds, 'Claim', errors);
    checkRefs([c], 'conflicting_claim_ids', claimIds, 'Claim', errors);
  }
  for (const s of data.sources) checkRefs([s], 'claim_ids', claimIds, 'Source', errors);

  for (const collection of ['groups','providers','policies']) for (const item of data[collection]) {
    if (item.assessment?.rating !== null && item.assessment?.rating !== undefined && (!Number.isInteger(item.assessment.rating) || item.assessment.rating < 1 || item.assessment.rating > 5))
      issue(errors, 'INVALID_RATING', `${collection} ${item.group_id ?? item.provider_id ?? item.policy_id} has rating outside 1–5.`);
    if (item.assessment?.rating === null && item.assessment?.confidence !== 'unknown')
      issue(errors, 'UNKNOWN_RATING_CONFIDENCE', `${collection} ${item.group_id ?? item.provider_id ?? item.policy_id} has an unknown rating but non-unknown confidence.`);
  }
  return { valid: errors.length === 0, errors, counts: Object.fromEntries(['groups','providers','policies','claims','sources'].map(k => [k, data[k].length])) };
}
