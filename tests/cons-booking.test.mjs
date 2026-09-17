import assert from "node:assert/strict";
import test from "node:test";

function buildBookingPayload(booking, route, eventId, parentStore, localStorage) {
  const details = booking?.details ?? {};
  const payload = { ...details };

  payload.user_id = Number(
    parentStore?.user?.id ??
    parentStore?.parent_id ??
    Number(localStorage.getItem("parent_id") ?? localStorage.getItem("user_id") ?? 0) ||
    0,
  );
  payload.event_id = Number(route.params.event_id ?? eventId ?? 0);
  payload.child_id = Number(route.params.child_id ?? 0);

  if (payload.child_problem && typeof payload.child_problem === "object") {
    payload.child_problem = payload.child_problem.code ?? payload.child_problem.id ?? payload.child_problem;
  }
  if (payload.child_aids && typeof payload.child_aids === "object") {
    payload.child_aids = payload.child_aids.id ?? payload.child_aids.code ?? payload.child_aids;
  }
  if (payload.doctor_code == null || payload.doctor_code === "") {
    delete payload.doctor_code;
  }

  delete payload.details;
  return payload;
}

test("booking payload is flattened and includes valid ids before posting", () => {
  const booking = {
    details: {
      requester_name: "Ali",
      relative_degree: "father",
      requester_phone: "0550000000",
      addtional_phone: "0551111111",
      addtional_phone_owner: "mother",
      addtional_phone_degree: "mother",
      conversion_type: "referral",
      child_doctor: "Dr. S",
      child_problem: { code: 2, name: "سمعيه" },
      child_aids: { id: 0, name: "no" },
      child_parents_problems: "Need support",
      parents_priorities: "Speech",
      child_aids_notes: "notes",
      doctor_code: 77,
    },
  };
  const route = { params: { event_id: "10", child_id: "7" } };
  const localStorage = {
    getItem: (key) => ({ parent_id: "42" }[key] ?? null),
  };

  const payload = buildBookingPayload(booking, route, "10", { parent_id: 42, user: { id: 42 } }, localStorage);

  assert.equal(payload.user_id, 42);
  assert.equal(payload.event_id, 10);
  assert.equal(payload.child_id, 7);
  assert.equal(payload.requester_name, "Ali");
  assert.equal(payload.relative_degree, "father");
  assert.equal(payload.child_problem, 2);
  assert.equal(payload.child_aids, 0);
  assert.equal(payload.doctor_code, 77);
  assert.equal(payload.details, undefined);
});
