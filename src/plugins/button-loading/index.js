import axios from "axios";

// Shows a spinner on the button that started a request and blocks repeat clicks
// until every request it started has finished. Works for all pages without
// touching each component: the last clicked (or submitting) button is linked to
// any axios request that starts shortly after the click.

const BUTTON_SELECTOR = "button, .p-button, .v-btn";
const CLICK_WINDOW_MS = 1000;
const PENDING_CLASS = "is-request-pending";

let lastButton = null;
let lastActionAt = 0;
const pending = new WeakMap();

// Buttons inside [data-no-request-spinner] (menus, buttons with their own :loading) are skipped,
// and a click anywhere else forgets the previous button so it doesn't pick up unrelated requests.
const remember = (button) => {
  lastButton = button && !button.closest("[data-no-request-spinner]") ? button : null;
  lastActionAt = Date.now();
};

const start = (button) => {
  const state = pending.get(button) ?? { count: 0, wasDisabled: button.disabled };
  state.count += 1;
  pending.set(button, state);
  if (state.count > 1) return;

  // Keep the spinner in the button's own text color even though the label is hidden.
  button.style.setProperty("--request-spinner-color", getComputedStyle(button).color);
  button.classList.add(PENDING_CLASS);
  button.setAttribute("aria-busy", "true");
  if ("disabled" in button) button.disabled = true;
};

const finish = (button) => {
  const state = pending.get(button);
  if (!state) return;
  state.count -= 1;
  if (state.count > 0) return;

  pending.delete(button);
  button.classList.remove(PENDING_CLASS);
  button.removeAttribute("aria-busy");
  button.style.removeProperty("--request-spinner-color");
  if ("disabled" in button) button.disabled = state.wasDisabled;
};

const injectStyles = () => {
  const style = document.createElement("style");
  style.dataset.buttonLoading = "";
  style.textContent = `
    button.${PENDING_CLASS}, .p-button.${PENDING_CLASS}, .v-btn.${PENDING_CLASS} {
      position: relative;
      color: transparent !important;
      cursor: progress !important;
      pointer-events: none;
    }
    button.${PENDING_CLASS} > *, .p-button.${PENDING_CLASS} > *, .v-btn.${PENDING_CLASS} > * {
      visibility: hidden;
    }
    button.${PENDING_CLASS}::after, .p-button.${PENDING_CLASS}::after, .v-btn.${PENDING_CLASS}::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1.1em;
      height: 1.1em;
      margin: -0.55em 0 0 -0.55em;
      border: 2px solid var(--request-spinner-color, currentColor);
      border-right-color: transparent;
      border-radius: 50%;
      animation: request-pending-spin 0.7s linear infinite;
    }
    @keyframes request-pending-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      button.${PENDING_CLASS}::after, .p-button.${PENDING_CLASS}::after, .v-btn.${PENDING_CLASS}::after {
        animation-duration: 2s;
      }
    }
  `;
  document.head.appendChild(style);
};

export default function installButtonLoading() {
  injectStyles();

  document.addEventListener(
    "click",
    (event) => remember(event.target.closest?.(BUTTON_SELECTOR)),
    true
  );
  // Pressing Enter inside a form submits it without a click on the button.
  document.addEventListener(
    "submit",
    (event) =>
      remember(event.submitter ?? event.target.querySelector?.("[type='submit']")),
    true
  );

  axios.interceptors.request.use((config) => {
    const recent = Date.now() - lastActionAt <= CLICK_WINDOW_MS;
    if (!config.skipButtonLoading && recent && lastButton?.isConnected) {
      config.pendingButton = lastButton;
      start(lastButton);
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      if (response.config?.pendingButton) finish(response.config.pendingButton);
      return response;
    },
    (error) => {
      if (error.config?.pendingButton) finish(error.config.pendingButton);
      return Promise.reject(error);
    }
  );
}
