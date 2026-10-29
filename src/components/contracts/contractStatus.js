// A contract's status: its tag colour and how it is printed (anything not approved carries «غير معتمد»).
import { contractDocument } from "./contractDocument";

export const STATUSES = ["draft", "sent", "approved", "rejected", "expired", "cancelled"];

export const statusSeverity = (status) =>
  ({ draft: "secondary", sent: "info", approved: "success", rejected: "danger", expired: "warn", cancelled: "contrast" })[status] || "secondary";

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
  return contractDocument(contract, { values: contract.values || {}, mark: approved ? "" : t("con.not_approved"), signatures: contract.signatures || {}, proof });
};
