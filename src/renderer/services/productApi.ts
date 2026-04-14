import { apiGet } from "./api";

export async function getProducts() {
  const res = await apiGet("/products");
  return res.data || [];
}

export async function createProduct(data: any) {
  const res = await fetch("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(uuid: string, data: any) {
  const res = await fetch(`/products/${uuid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(uuid: string) {
  await fetch(`/products/${uuid}`, {
    method: "DELETE",
  });
}