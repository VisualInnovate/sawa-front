import axios from "axios";

// Sends a "contact us" message to the academy's e-mail (site settings). The API reads query params.
export const sendContactMessage = ({ firstName, lastName, email, phone, message }) =>
  axios.get("api/contact", {
    params: { first_name: firstName, last_name: lastName, email, phone, message },
    skipAuth: true,
  });

// "Full name" fields: first word is the first name, the rest the family name (the API wants both).
export const splitFullName = (fullName) => {
  const parts = String(fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") || parts[0] || "" };
};

export const contactErrorText = (error, t) => {
  const errors = error.response?.data?.errors;
  if (errors) return Object.values(errors).flat()[0];
  return t("request_failed_retry");
};
