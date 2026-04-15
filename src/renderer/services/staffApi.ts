import { apiGet, apiPost } from "./api";

// 👤 Staff type
export interface Staff {
  user_uuid: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

// 📋 Get staff list
export async function getStaff(): Promise<Staff[]> {
  return await apiGet("/staff");
}

// ➕ Create staff
export async function createStaff(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<Staff> {
  return await apiPost("/staff", data);
}