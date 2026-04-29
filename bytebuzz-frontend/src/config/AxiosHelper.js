import axios from "axios";
export const baseURL = "https://bytebuzz-chat.onrender.com";
export const httpClient = axios.create({
  baseURL: baseURL,
});
