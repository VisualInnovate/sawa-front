import axios from "axios";

// Evaluation request lifecycle: awaiting → in progress (specialist presses start) → finished (results saved).
export const REQUEST_STATUS = { AWAITING: 0, FINISHED: 1, IN_PROGRESS: 2 };

const statuses = {
  [REQUEST_STATUS.AWAITING]: { key: "status_awaiting_evaluation", severity: "warn" },
  [REQUEST_STATUS.IN_PROGRESS]: { key: "status_in_progress", severity: "info" },
  [REQUEST_STATUS.FINISHED]: { key: "status_finished", severity: "success" },
};

export function requestStatus(status) {
  return statuses[Number(status)] ?? statuses[REQUEST_STATUS.AWAITING];
}

export function isRequestOpen(request) {
  return Number(request?.status) !== REQUEST_STATUS.FINISHED;
}

export function startEvaluationRequest(id) {
  return axios.post(`api/evaluation-request/${id}/start`);
}
