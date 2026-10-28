// The public careers page talks to api/careers/* with the candidate's own token (not the staff or parents' one).
import axios from "axios";

const KEY = "careersToken";

export const careersToken = {
  get() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(KEY, token);
    } catch {
      // Private windows: the session lasts this page only.
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // nothing stored
    }
  },
};

/** A careers request: never the dashboard's token, never the dashboard's sign-in redirect. */
export function careersApi(method, url, data, extra = {}) {
  const token = careersToken.get();
  return axios({
    method,
    url: `api/careers/${url}`,
    data,
    skipAuth: true,
    skipAuthRedirect: true,
    ...extra,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(extra.headers ?? {}) },
  });
}

/** An IBAN of the labour system: its prefix and length, and the ISO 13616 check (mod 97). */
export function ibanValid(iban, prefix, length) {
  const value = String(iban ?? "").replace(/\s+/g, "").toUpperCase();
  if (value.length !== length || !value.startsWith(prefix) || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(value)) return false;
  const moved = value.slice(4) + value.slice(0, 4);
  const numeric = moved.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) remainder = Number(String(remainder) + numeric.slice(i, i + 7)) % 97;
  return remainder === 1;
}

/** The server's message codes («hr.iban») become the page's texts (careers.err.iban); others stay generic. */
export function serverMessage(t, te, message) {
  if (typeof message === "string" && message.startsWith("hr.") && te(`careers.err.${message.slice(3)}`)) return t(`careers.err.${message.slice(3)}`);
  return t("careers.err.invalid");
}
