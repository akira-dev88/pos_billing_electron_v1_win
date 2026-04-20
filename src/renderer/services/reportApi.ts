import { apiGet } from "./api";

const API = "http://127.0.0.1:8000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function getDashboardReport() {
  try {
    const res = await fetch(`${API}/reports/dashboard`, {
      headers: getHeaders(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Dashboard API error:", res.status, errorText);
      throw new Error(`Dashboard failed: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Dashboard data received:", data);
    
    // Ensure the data has all required fields
    return {
      today_sales: data.today_sales || 0,
      month_sales: data.month_sales || 0,
      total_sales: data.total_sales || 0,
      total_orders: data.total_orders || 0,
      low_stock: data.low_stock || [],
      recent_sales: data.recent_sales || [],
      recent_purchases: data.recent_purchases || [],
      top_products: data.top_products || [],
      ...data
    };
  } catch (error) {
    console.error("Dashboard API error:", error);
    // Return default data structure instead of throwing
    return {
      today_sales: 0,
      month_sales: 0,
      total_sales: 0,
      total_orders: 0,
      low_stock: [],
      recent_sales: [],
      recent_purchases: [],
      top_products: [],
    };
  }
}

export async function getTopProducts() {
  try {
    const res = await fetch(`${API}/reports/top-products`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Top products failed");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Top products API error:", error);
    return [];
  }
}

export async function getStockReport() {
  try {
    const res = await fetch(`${API}/reports/stock`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Stock failed");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Stock report API error:", error);
    return [];
  }
}

export async function getProfitReport() {
  try {
    const res = await fetch(`${API}/reports/profit`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Profit failed");
    return res.json();
  } catch (error) {
    console.error("Profit API error:", error);
    throw error;
  }
}

export async function getSalesTrend() {
  try {
    const data = await apiGet("/reports/sales-trend");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Sales trend API error:", error);
    return [];
  }
}

export async function getProfitTrend() {
  try {
    const data = await apiGet("/reports/profit-trend");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Profit trend API error:", error);
    return [];
  }
}