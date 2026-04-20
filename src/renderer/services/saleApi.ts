import { apiGet, apiPost } from "./api";

export interface Sale {
  customer: any;
  customer: any;
  customer: any;
  customer: any;
  sale_uuid: string;
  invoice_number: string;
  grand_total: string;
  created_at: string;
}

export interface InvoiceItem {
  quantity: number;
  quantity: number;
  price(price: any): import("react").ReactNode;
  name: string;
  qty: number;
  total: number;
}

export interface Invoice {
  payment_method: boolean;
  amount: number;
  gst: number;
  cart: any;
  cart: any;
  customer_name: any;
  customer_name: any;
  payments: any;
  payments: boolean;
  payments: any;
  total_amount: number;
  tax: number;
  subtotal: number;
  total: number;
  created_at: number;
  sale_uuid: any;
  grand_total: number;
  grand_total: number;
  grand_total: number;
  customer: any;
  customer: any;
  customer: any;
  customer: any;
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