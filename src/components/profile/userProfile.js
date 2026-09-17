import axios from "axios";

// The three profile tabs read the same `api/users/{id}` payload; share one request between them.
let cached = null;

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
}
