const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

async function request(
  path,
  { method = "GET", body, headers = {}, auth = true } = {},
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),

  post: (path, body, opts) =>
    request(path, {
      ...opts,
      method: "POST",
      body,
    }),

  put: (path, body, opts) =>
    request(path, {
      ...opts,
      method: "PUT",
      body,
    }),

  patch: (path, body, opts) =>
    request(path, {
      ...opts,
      method: "PATCH",
      body,
    }),

  delete: (path, opts) =>
    request(path, {
      ...opts,
      method: "DELETE",
    }),
};
