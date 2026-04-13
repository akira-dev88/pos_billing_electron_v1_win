import { apiGet } from "./api";

export async function getCustomers() {
  return await apiGet("/customers");
}