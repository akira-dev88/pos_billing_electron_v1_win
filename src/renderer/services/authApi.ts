import { apiPost } from "./api";

export async function login(email: string, password: string) {
  const res = await apiPost("/login", { email, password });

  if (res.token) {
    localStorage.setItem("token", res.token);
  }

  return res;
}