import { apiGet, apiPost } from "./api";

export async function checkoutCart(
  cart_uuid: string,
  payments: { method: string; amount: number }[],
  customer_uuid?: string | null
) {
  return await apiPost(`/carts/${cart_uuid}/checkout`, {
    payments,
    customer_uuid: customer_uuid || null,
  });
}

export async function getInvoice(sale_uuid: string) {
  return await apiGet(`/sales/${sale_uuid}/invoice`);
}