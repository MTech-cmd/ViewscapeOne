import { loadDataset, validateDataset } from './validation.js';
const data = await loadDataset();
const result = validateDataset(data);
console.log('Dataset counts:', result.counts);
if (!result.valid) { for (const e of result.errors) console.error(`[${e.code}] ${e.message}`); process.exitCode = 1; }
else console.log('Validation passed: identifiers and relationships are consistent.');
