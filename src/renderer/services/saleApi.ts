import { apiGet, apiPost } from "./api";

export interface Sale {
  sale_uuid: string;
  invoice_number: string;
  grand_total: string;
  created_at: string;
}

export interface InvoiceItem {
  name: string;
  qty: number;
  total: number;
}

export interface Invoice {
  invoice_number?: string;
  shop?: {
    name: string;
    address: string;
    gstin: string;
  };
  items?: InvoiceItem[];
  summary?: {
    total: number;
    tax: number;
    grand_total: number;
  };
}

export async function getSales(): Promise<Sale[]> {
  return await apiGet("/sales");
}

export async function getInvoice(
  saleUUID: string
): Promise<Invoice> {
  return await apiGet(`/sales/${saleUUID}/invoice`);
}

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