import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from '@vue/compiler-sfc';
import moment from 'moment';

// Run the page's own handlers with mocked HTTP responses, without creating appointments.
const { descriptor } = parse(readFileSync(new URL('../src/views/calender/Index.vue', import.meta.url), 'utf8'));
const script = descriptor.script.content.replace(/^import .*;\r?\n/gm, '').replace('export default', 'return');
function page(axios) {
  const dependencies = {
    axios, moment, arLocale: {}, FullCalendar: {}, TimeGridPlugin: {}, dayGridPlugin: {},
    interactionPlugin: {}, listPlugin: {}, DatePicker: {}, InputText: {},
    useAppLangStore: () => ({}), localStorage: { getItem: () => '9' },
  };
  const component = new Function(...Object.keys(dependencies), script)(...Object.values(dependencies));
  const messages = [];
  const context = { $toast: { add: value => messages.push(value) }, $t: value => value };
  for (const [name, method] of Object.entries(component.methods)) context[name] = method.bind(context);
  Object.assign(context, component.data.call(context));
  return { context, messages };
}
const staff = { data: { data: { employees: [{ id: 45, name: 'Therapist A' }, { id: 46, name: 'Therapist B' }] } } };
const day = { start: '2026-09-20T09:00:00', end: '2026-09-20T17:00:00' };
const calendar = { data: { data: { days: [day], booked: [] } } };
const slot = () => ({ start: new Date(2026, 8, 20, 10), end: new Date(2026, 8, 20, 10, 30), allDay: false });

test('evaluation handler uses the newly emitted value and requires manual therapist selection', async () => {
  const urls = [];
  const { context } = page({ get: async url => { urls.push(url); return staff; } });
  assert.equal(context.event.evaluation_type, 2);
  await context.fetchEmployees(3);
  assert.deepEqual(urls, ['api/employees/get/with/3']);
  assert.equal(context.event.evaluation_type, 3);
  assert.deepEqual(context.employees.map(employee => employee.id), [45, 46]);
  assert.equal(context.event.employee_id, null);
  assert.equal(context.opts.selectable, false);
  assert.equal(context.employeesLoading, false);
});

test('selecting a therapist loads appointments and posts that therapist and the chosen slot', async () => {
  const posts = [];
  const urls = [];
  const { context } = page({
    get: async url => { urls.push(url); return url.includes('/calendar/') ? calendar : staff; },
    post: async (url, body) => { posts.push({ url, body }); return {}; },
  });
  await context.fetchEmployees();
  await context.getTimes(45);
  assert.equal(context.event.employee_id, 45);
  assert.equal(context.avalible_day.length, 1);
  assert.equal(context.opts.selectable, true);
  // Month starts outside this therapist's working day; time view must still have usable bounds.
  context.handleDatesSet({ startStr: '2026-09-01' });
  assert.equal(context.opts.slotMinTime, '09:00:00');
  assert.equal(context.opts.slotMaxTime, '17:00:00');
  context.event.child_id = 236;
  context.event.title = 'Evaluation';
  context.handleSelect(slot());
  assert.equal(context.visible, true);
  await context.create();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].url, 'api/evaluation-request');
  assert.equal(posts[0].body.employee_id, 45);
  assert.equal(posts[0].body.child_id, 236);
  assert.equal(posts[0].body.date, '2026-09-20');
  assert.equal(posts[0].body.start_time, '10:00:00');
  assert.equal(posts[0].body.end_time, '10:30:00');
  assert.equal(urls.at(-1), 'api/employees/get/with/calendar/45?type=1');
  assert.equal(context.opts.event, null);
});

test('supports keyed employee and appointment collections without clearing returned data', async () => {
  const { context } = page({ get: async url => url.includes('/calendar/')
    ? { data: { data: { days: { 4: day }, booked: {} } } }
    : { data: { data: { employees: { 8: { id: '45', name: 'Therapist A' } } } } },
  });
  await context.fetchEmployees(4);
  assert.equal(context.employees[0].id, 45);
  await context.getTimes(45);
  assert.equal(context.business_hours.length, 1);
  assert.equal(context.opts.events.length, 1);
  assert.equal(context.calendarError, '');
});

test('blocks confirmation without a therapist and clears old slot when therapist changes', async () => {
  const { context, messages } = page({
    get: async url => url.includes('/calendar/') ? calendar : staff,
    post: async () => assert.fail('An invalid booking must not be posted'),
  });
  await context.fetchEmployees();
  await context.create();
  assert.equal(messages.at(-1).detail, 'select_evaluation_employee');
  await context.getTimes(45);
  context.handleSelect(slot());
  assert.equal(context.visible, true);
  await context.getTimes(46);
  assert.equal(context.visible, false);
  assert.equal(context.opts.event, null);
  await context.create();
  assert.equal(messages.at(-1).detail, 'calendar_select_slot');
  await context.fetchEmployees(3);
  await context.create();
  assert.equal(messages.at(-1).detail, 'select_evaluation_employee');
});

test('ignores outdated responses even when returning to the same evaluation type', async () => {
  const requests = [];
  const { context } = page({ get: () => new Promise(resolve => requests.push(resolve)) });
  const first = context.fetchEmployees(2);
  const second = context.fetchEmployees(3);
  const third = context.fetchEmployees(2);
  requests[2](staff);
  await third;
  requests[0]({ data: { data: { employees: [{ id: 10, name: 'Outdated' }] } } });
  requests[1]({ data: { data: { employees: [] } } });
  await Promise.all([first, second]);
  assert.deepEqual(context.employees.map(employee => employee.id), [45, 46]);
});

test('a late calendar response cannot replace the currently selected therapist schedule', async () => {
  const requests = [];
  const { context } = page({ get: () => new Promise(resolve => requests.push(resolve)) });
  context.employees = staff.data.data.employees;
  const first = context.getTimes(45);
  const second = context.getTimes(46);
  requests[1]({ data: { data: { days: [], booked: [] } } });
  await second;
  requests[0](calendar);
  await first;
  assert.equal(context.event.employee_id, 46);
  assert.equal(context.avalible_day.length, 0);
  assert.equal(context.opts.selectable, false);
  assert.equal(context.opts.slotMaxTime, '24:00:00');
});

test('failed calendar requests keep therapist options available for another selection', async () => {
  const { context } = page({ get: async url => {
    if (url.includes('/calendar/')) throw new Error('Network error');
    return staff;
  } });
  await context.fetchEmployees();
  await context.getTimes(45);
  assert.equal(context.employees.length, 2);
  assert.equal(context.calendarLoading, false);
  assert.equal(context.calendarError, 'request_failed_retry');
});

test('selection stays within available appointments and rejects booking overlaps', async () => {
  const { context } = page({ get: async () => ({ data: { data: { days: [day], booked: [
    { id: 8, date: '2026-09-20', start_time: '10:10:00', end_time: '10:20:00', color: 'ffffff' },
  ] } } }) });
  context.employees = staff.data.data.employees;
  await context.getTimes(45);
  assert.equal(context.canSelectSlot(slot()), false);
  assert.equal(context.canSelectSlot({ start: new Date(2026, 8, 20, 11), end: new Date(2026, 8, 20, 12) }), true);
  assert.equal(context.canSelectSlot({ start: new Date(2026, 8, 21, 11), end: new Date(2026, 8, 21, 12) }), false);
});
