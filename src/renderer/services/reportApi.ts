export async function getDashboardReport() {
  const res = await fetch("/reports/dashboard");
  return res.json();
}

export async function getTopProducts() {
  const res = await fetch("/reports/top-products");
  return res.json();
}

export async function getStockReport() {
  const res = await fetch("/reports/stock");
  return res.json();
}

export async function getProfitReport() {
  const res = await fetch("/reports/profit");
  return res.json();
}