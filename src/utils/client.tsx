import axios from "axios";

/**
 * Axios client for main backend
 */
const client = axios.create({
  baseURL: "https://jar-tenants.dev.myjar.app",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export default client;
