import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDataset, validateDataset } from '../modules/validation.js';

test('seed dataset has unique identifiers and valid references', async () => {
  const data = await loadDataset();
  const result = validateDataset(data);
  assert.equal(result.valid, true, JSON.stringify(result.errors));
  assert.deepEqual(result.counts, {groups:5,providers:5,policies:0,claims:0,sources:0});
});

test('unknown assessments remain null and are not assigned a score', async () => {
  const data = await loadDataset();
  for (const entity of [...data.groups,...data.providers]) {
    assert.equal(entity.assessment.rating, null);
    assert.equal(entity.assessment.confidence, 'unknown');
  }
});

test('validator detects broken provider-to-group relationship', async () => {
  const data = await loadDataset();
  data.providers[0].group_id = 'missing-group';
  const result = validateDataset(data);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.code === 'BROKEN_GROUP'));
});

test('validator detects duplicate identifiers', async () => {
  const data = await loadDataset();
  data.groups.push({...data.groups[0]});
  const result = validateDataset(data);
  assert.ok(result.errors.some(e => e.code === 'DUPLICATE_ID'));
});

test('validator rejects a numeric rating outside the defined scale', async () => {
  const data = await loadDataset();
  data.groups[0].assessment.rating = 6;
  const result = validateDataset(data);
  assert.ok(result.errors.some(e => e.code === 'INVALID_RATING'));
});
