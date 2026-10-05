import test from 'node:test';
import assert from 'node:assert/strict';
import { createSummaryTables, newSummaryPoint, restoreSummaryTables } from '../src/components/reports/summaryDraft.js';

const evaluation = { result: {
  levels: [{ level_id: 1, level_name: 'Level 1' }, { level_id: 3, level_name: 'Level 3' }],
  summary: [
    { level_id: 1, symbol: 'M', strength: [{ question: 'First strength' }], weak: [{ question: 'First weakness' }] },
    { level_id: 1, symbol: 'M', strength: [{ question: 'Second strength' }], weak: [{ question: 'Second weakness' }] },
    { level_id: 3, symbol: 'M', strength: [{ question: 'Other level' }] },
  ],
} };

test('plan points share one symbol row within each level', () => {
  const tables = createSummaryTables(evaluation);
  assert.deepEqual(tables.map(table => table.key), ['1', '3']);
  assert.equal(tables[0].rows.length, 1);
  const row = tables[0].rows[0];
  assert.equal(row.symbol, 'M');
  assert.deepEqual(row.strengths.map(point => point.text), ['First strength', 'Second strength']);
  assert.deepEqual(row.weaknesses.map(point => point.text), ['First weakness', 'Second weakness']);
  assert.equal(new Set([...row.strengths, ...row.weaknesses].map(point => point.id)).size, 4);
});

test('reopening a plan preserves edits, added points and deletion of every point', () => {
  const tables = createSummaryTables(evaluation);
  tables[0].rows[0].strengths[0].text = 'Edited';
  tables[0].rows[0].strengths.push(newSummaryPoint('Added'));
  tables[0].rows[0].weaknesses = [];
  const restored = restoreSummaryTables(createSummaryTables(evaluation), JSON.parse(JSON.stringify(tables)));
  assert.deepEqual(restored[0].rows[0].strengths.map(point => point.text), ['Edited', 'Second strength', 'Added']);
  assert.deepEqual(restored[0].rows[0].weaknesses, []);
  assert.equal(evaluation.result.summary[0].strength[0].question, 'First strength');
  assert.deepEqual(restoreSummaryTables(createSummaryTables(evaluation), undefined).map(table => table.key), ['1', '3']);
});
