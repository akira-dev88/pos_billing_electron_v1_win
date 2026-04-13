import { apiGet, apiPost } from "./api";

export async function getCustomers() {
  return await apiGet("/customers");
}

export async function createCustomer(data: {
  name: string;
  mobile?: string;
}) {
  return await apiPost("/customers", data);
}

export async function getCustomerLedger(customer_uuid: string) {
  return await apiGet(`/customers/${customer_uuid}/ledger`);
}

export async function addCustomerPayment(
  customer_uuid: string,
  data: { amount: number; method: string }
) {
  return await apiPost(`/customers/${customer_uuid}/payments`, data);
}