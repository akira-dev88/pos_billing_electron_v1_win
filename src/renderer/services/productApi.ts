import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getProducts() {
  const res = await apiGet("/products");

  // 🔥 FIX: always return array
  return res?.data || [];
}

export async function createProduct(data: any) {
  return apiPost("/products", data);
}

export async function updateProduct(uuid: string, data: any) {
  return apiPut(`/products/${uuid}`, data);
}

export async function deleteProduct(uuid: string) {
  return apiDelete(`/products/${uuid}`);
}