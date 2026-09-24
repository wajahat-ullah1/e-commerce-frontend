import { api } from "./api";

function normalizeAddress(a) {
  if (!a) return a;
  return {
    id: a.id,
    label: a.label || "Address",
    line1: a.addressLine1,
    line2: a.addressLine2 || "",
    city: a.city,
    state: a.state || "",
    postalCode: a.postalCode,
    country: a.country,
    isDefault: a.isDefault,
  };
}

function toBackendShape(addr) {
  return {
    addressLine1: addr.line1,
    addressLine2: addr.line2 || undefined,
    city: addr.city,
    state: addr.state || undefined,
    postalCode: addr.postalCode,
    country: addr.country,
    isDefault: addr.isDefault,
  };
}

export const addressService = {
  list: () =>
    api
      .get("/addresses")
      .then((res) => (res.addresses || []).map(normalizeAddress)),

  create: (addr) =>
    api
      .post("/addresses", toBackendShape(addr))
      .then((res) => normalizeAddress(res.address)),

  update: (id, addr) =>
    api
      .put(`/addresses/${id}`, toBackendShape(addr))
      .then((res) => normalizeAddress(res.address)),

  remove: (id) => api.delete(`/addresses/${id}`),

  setDefault: (id) =>
    api
      .put(`/addresses/${id}/default`)
      .then((res) => normalizeAddress(res.address)),
};