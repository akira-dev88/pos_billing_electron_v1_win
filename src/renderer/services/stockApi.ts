const BASE_URL = "http://127.0.0.1:8000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function getStock() {
  const res = await fetch(`${BASE_URL}/reports/stock`, {
    headers: getHeaders(),
  });

  return res.json();
}

export async function updateStock(productUUID: string, stock: number) {
  const res = await fetch(`${BASE_URL}/products/${productUUID}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ stock }),
  });

  return res.json();
}