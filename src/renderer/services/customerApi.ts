import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Customer {
  customer_uuid: string;
  name: string;
  mobile?: string;
  address?: string;
  gstin?: string;
  credit_balance?: number;
  created_at: string;
}

export async function getCustomers() {
  return await apiGet("/customers");
}

export async function createCustomer(data: any) {
  return await apiPost("/customers", data);
}

export async function getLedger(customer_uuid: string) {
  return await apiGet(`/customers/${customer_uuid}/ledger`);
}

export async function addCustomerPayment(
  customer_uuid: string,
  data: { amount: number; method: string }
) {
  return await apiPost(`/customers/${customer_uuid}/payments`, data);
}

// ✏️ update
export async function updateCustomer(uuid: string, data: Partial<Customer>) {
  return await apiPut(`/customers/${uuid}`, data);
}

// ❌ delete
export async function deleteCustomer(uuid: string) {
  return await apiDelete(`/customers/${uuid}`);
}

// 📊 ledger
export async function getCustomerLedger(uuid: string) {
  return await apiGet(`/customers/${uuid}/ledger`);
}

export async function getCustomerSummary() {
  return await apiGet("/customers/summary");
}