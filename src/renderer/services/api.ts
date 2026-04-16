const BASE_URL = "http://127.0.0.1:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

// 🔧 Common headers
function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// GET
export async function apiGet(url: string) {
  const res = await fetch(BASE_URL + url, {
    headers: getHeaders(),
  });

  const data = await res.json();

  // 🔥 normalize response
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;

  return data;
}

// POST
export async function apiPost(url: string, data: any) {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// PUT ✅
export async function apiPut(url: string, data: any) {
  const res = await fetch(BASE_URL + url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// DELETE ✅
export async function apiDelete(url: string) {
  const res = await fetch(BASE_URL + url, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return res.json();
}