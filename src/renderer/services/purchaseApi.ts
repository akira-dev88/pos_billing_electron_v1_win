import { apiGet, apiPost } from "./api";

export interface PurchaseItemInput {
  product_uuid: string;
  quantity: number;
  cost_price: number;
}

export interface PurchasePayload {
  supplier_uuid?: string | null;
  items: PurchaseItemInput[];
}

export async function createPurchase(data: PurchasePayload) {
  return await apiPost("/purchases", data);
}

export async function getPurchases() {
  return await apiGet("/purchases");
}