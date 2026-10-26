import axios from "axios";
import { resetUserProfile } from "../components/profile/userProfile";

// Evaluation request lifecycle: awaiting → in progress (specialist presses start) → finished (results saved);
// cancelled when it was not paid by its appointment («المحاسبة»).
export const REQUEST_STATUS = { AWAITING: 0, FINISHED: 1, IN_PROGRESS: 2, CANCELLED: 3 };

const statuses = {
  [REQUEST_STATUS.AWAITING]: { key: "status_awaiting_evaluation", severity: "warn" },
  [REQUEST_STATUS.IN_PROGRESS]: { key: "status_in_progress", severity: "info" },
  [REQUEST_STATUS.FINISHED]: { key: "status_finished", severity: "success" },
  [REQUEST_STATUS.CANCELLED]: { key: "acc.billing.cancelled", severity: "danger" },
};

export function requestStatus(status) {
  return statuses[Number(status)] ?? statuses[REQUEST_STATUS.AWAITING];
}

export function isRequestOpen(request) {
  return ![REQUEST_STATUS.FINISHED, REQUEST_STATUS.CANCELLED].includes(Number(request?.status));
}

// Closed by the accounting until it is paid (or confirmed): it cannot be started yet.
export function isRequestLocked(request) {
  return request?.billing_status === "locked" || request?.billing_status === "cancelled";
}

export async function startEvaluationRequest(id) {
  const response = await axios.post(`api/evaluation-request/${id}/start`);
  // The profile tabs cache their payload; reload it so the request shows as in progress.
  resetUserProfile();
  return response;
}
