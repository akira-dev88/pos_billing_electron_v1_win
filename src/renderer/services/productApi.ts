import { apiGet } from "./api";

export async function getProducts() {
  const res = await apiGet("/products");
  return res.data || [];
}