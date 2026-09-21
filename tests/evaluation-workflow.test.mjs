import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { resolveSideProfileDimension } from '../src/utils/evaluationTypes.js';

function component(path, axios) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  const context = { module: { exports: {} }, axios, InputText: {}, DatePicker: {}, EvaluationType: {},
    resetUserProfile() {}, moment: () => ({ format: () => '2026-09-21' }) };
  vm.runInNewContext(source.replace(/^import .*;?\s*$/gm, '').replace('export default', 'module.exports ='), context);
  return context.module.exports;
}

test('milestone loads a flat question response including an empty age-zero response', async () => {
  let questions = [{ id: 17, title: 'Question', question_type_id: 3, subtest_id: 8,
    question_type: { title: 'Domain' }, subtest: { title: 'Goal' } }];
  const view = component('../src/views/evaluation/milestone-evalution/index.vue', {
    post: async () => ({ data: 0 }), get: async () => ({ data: questions }),
  });
  const state = { ...view.data(), answer: { date: new Date(), child_id: 7 }, $t: key => key };
  await view.methods.getage.call(state);
  assert.equal(state.answer.child_age, 0);
  assert.equal(state.allquestion.length, 1);
  const grouped = view.computed.questionGroups.call(state);
  assert.equal(grouped[0].title, 'Domain');
  assert.equal(grouped[0].goals[0].title, 'Goal');
  assert.equal(grouped[0].goals[0].questions[0].id, 17);
  questions = [];
  await view.methods.getage.call(state);
  assert.equal(state.allquestion.length, 0);
  assert.equal(state.questionsLoading, false);
  assert.equal(state.alert_text, '');
});

test('milestone groups interleaved questions by domain and goal', () => {
  const view = component('../src/views/evaluation/milestone-evalution/index.vue', {});
  const state = { $t: key => key, allquestion: [
    { id: 1, question_type_id: 2, subtest_id: 8 },
    { id: 2, question_type_id: 3, subtest_id: 9 },
    { id: 3, question_type_id: 2, subtest_id: 8 },
    { id: 4, question_type_id: 2, subtest_id: 10 },
  ] };
  const groups = view.computed.questionGroups.call(state);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].goals.length, 2);
  assert.equal(groups[0].goals[0].questions.map(q => q.id).join(','), '1,3');
});

test('side profile waits for basal persistence and submits the exact request context', async () => {
  let release, submitted;
  const view = component('../src/views/evaluations/Show.vue', {
    post: async (url, payload) => { submitted = { url, payload }; await new Promise(resolve => { release = resolve; }); },
  });
  const state = { ...view.data(), selected: [undefined, '1'], child: { childInMonths: 36 }, child_id: 7,
    $route: { params: { id: 15 }, query: { requestId: 186 } }, examDateText: '2026-09-21',
    $t: key => key, $toast: { add() { assert.fail('unexpected save error'); } } };
  const saving = view.methods.saveResult.call(state, 3);
  assert.equal(state.load, true);
  assert.equal(state.saved, false);
  assert.equal(submitted.url, '/api/evaluations/15/3/basalAge');
  assert.equal(submitted.payload.request_id, 186);
  release();
  await saving;
  assert.equal(state.saved, true);
  assert.equal(state.load, false);
});

test('side profile failed saves retain the answers and allow retry', async () => {
  const view = component('../src/views/evaluations/Show.vue', { post: async () => { throw new Error('offline'); } });
  const state = { ...view.data(), selected: ['1'], child: { childInMonths: 36 }, child_id: 7,
    $route: { params: { id: 15 }, query: {} }, $t: key => key, $toast: { add() {} } };
  await view.methods.saveResult.call(state);
  assert.equal(state.saved, false);
  assert.equal(state.load, false);
  assert.equal(state.selected[0], '1');
  assert.equal(state.child.childInMonths, 36);
});

test('booking dimension resolution is independent of database IDs and response order', () => {
  const rows = [{ id: 15, title: 'البعد الاتصالي' }, { id: 97, title: 'البعد المعرفي' }];
  assert.equal(resolveSideProfileDimension(rows, 0).id, 97);
  assert.equal(resolveSideProfileDimension(rows, 4).id, 15);
  assert.equal(resolveSideProfileDimension(rows, 1), null);
});
