import axios from "axios";

// Profile details, evaluation requests, and results share the same user payload.
let cached = null;
export const USER_PROFILE_INVALIDATED_EVENT = "sawa:user-profile-invalidated";

export function fetchUserProfile({ refresh = false } = {}) {
  const id = localStorage.getItem("user_id");
  if (refresh || !cached || cached.id !== id) {
    const promise = axios.get(`api/users/${id}`).then((response) => response.data);
    promise.catch(() => {
      if (cached?.promise === promise) cached = null;
    });
    cached = { id, promise };
  }
  return cached.promise;
}

export function resetUserProfile() {
  cached = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(USER_PROFILE_INVALIDATED_EVENT));
  }
}
