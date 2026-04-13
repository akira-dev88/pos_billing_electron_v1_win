import { apiGet } from "./api";

export async function getProducts() {
  const res = await apiGet("/products");
  return res.data || [];
}

export async function searchProducts(query: string) {
  const res = await apiGet(`/products/search?q=${query}`);
  return res.data || [];
}

export async function findByBarcode(barcode: string) {
  const res = await apiGet(`/products/scan/${barcode}`);
  return res.data;
}