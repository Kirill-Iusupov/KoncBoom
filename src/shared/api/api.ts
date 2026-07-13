import axios from "axios";

// baseURL относительный: фронт и API за одним nginx на одном origin.
// Работает по IP и по домену, по HTTP и HTTPS без пересборки образа.
// Same-origin ⇒ CORS-preflight не возникает.
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});