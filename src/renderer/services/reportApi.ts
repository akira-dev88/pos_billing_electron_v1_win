const API = "http://127.0.0.1:8000/api";

export async function getDashboardReport() {
  const res = await fetch(`${API}/reports/dashboard`);
  return res.json();
}

export async function getTopProducts() {
  const res = await fetch(`${API}/reports/top-products`);
  return res.json();
}

export async function getStockReport() {
  const res = await fetch(`${API}/reports/stock`);
  return res.json();
}

export async function getProfitReport() {
  const res = await fetch(`${API}/reports/profit`);
  return res.json();
}