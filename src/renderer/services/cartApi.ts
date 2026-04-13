import { apiPost, apiGet } from "./api";

export async function createCart() {
  return await apiPost("/carts", {});
}

export async function addItem(cart_uuid: string, product_uuid: string) {
  return await apiPost(`/carts/${cart_uuid}/items`, {
    product_uuid,
    quantity: 1,
  });
}

export async function getCart(cart_uuid: string) {
  return await apiGet(`/carts/${cart_uuid}`);
}