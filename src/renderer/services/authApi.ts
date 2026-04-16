import { apiPost } from "./api";

export async function login(email: string, password: string) {
  const res = await apiPost("/login", { email, password });

  return res;
}