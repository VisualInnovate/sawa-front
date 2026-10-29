// Whether the signed-in user approves leaves (a department head, HR or the general manager) and how many wait for
// them: shows «الموافقات» in the menu. Read once per page load.
import axios from "axios";
import { reactive } from "vue";

export const approver = reactive({ is: false, waiting: 0, loaded: false });

let loading = null;
export const loadApprover = (force = false) => {
  if (force) loading = null;
  loading ??= axios.get("/api/approvals")
    .then(({ data }) => Object.assign(approver, { is: !!data?.data?.is_approver, waiting: data?.data?.waiting ?? 0, loaded: true }))
    .catch(() => { loading = null; });

  return loading;
};
