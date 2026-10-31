// A contract's status: its tag colour and how it is printed (anything not approved carries «غير معتمد»).
import { contractDocument } from "./contractDocument";

export const STATUSES = ["draft", "sent", "approved", "rejected", "expired", "cancelled"];

// The employees' documents first go to the general manager (pending_approval) and wait to be signed (ready).
export const EMPLOYEE_STATUSES = ["draft", "pending_approval", "ready", "sent", "approved", "rejected", "expired", "cancelled"];

export const statusSeverity = (status) =>
  ({ draft: "secondary", pending_approval: "warn", ready: "info", sent: "info", approved: "success", rejected: "danger", expired: "warn", cancelled: "contrast" })[status] || "secondary";

/** The contract as a printable page: its values, both signatures, and — once approved — the proof to check it. */
export const contractPage = (contract, t) => {
  const approved = contract.status === "approved";
  const proof = approved && contract.verify_code
    ? [
        [t("con.proof_signed"), t("con.proof_electronic")],
        [t("con.proof_code"), contract.verify_code],
        [t("con.proof_check"), `${window.location.origin}/contract-check/${contract.verify_code}`],
        [t("con.proof_hash"), String(contract.content_hash || "").slice(0, 16)],
      ]
    : [];
  // An employee's documents name the parties «الطرف الأول / الثاني», the parents' contracts «الفريق».
  const parties = contract.audience === "employee" ? ["الطرف الأول", "الطرف الثاني"] : undefined;
  return contractDocument(contract, { values: contract.values || {}, mark: approved ? "" : t("con.not_approved"), signatures: contract.signatures || {}, proof, ...(parties ? { parties } : {}) });
};
