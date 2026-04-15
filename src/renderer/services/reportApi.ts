import { apiGet } from "./api";

const API = "http://127.0.0.1:8000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    // 🔥 ADD THIS if using auth
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function getDashboardReport() {
  const res = await fetch(`${API}/reports/dashboard`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Dashboard failed");
  return res.json();
}

export async function getTopProducts() {
  const res = await fetch(`${API}/reports/top-products`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Top products failed");
  return res.json();
}

export async function getStockReport() {
  const res = await fetch(`${API}/reports/stock`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Stock failed");
  return res.json();
}

export async function getProfitReport() {
  const res = await fetch(`${API}/reports/profit`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Profit failed");
  return res.json();
}

export async function getSalesTrend() {
  return await apiGet("/reports/sales-trend");
}