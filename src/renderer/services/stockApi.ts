export async function getStock() {
  const res = await fetch("/reports/stock");
  return res.json();
}

export async function updateStock(productUUID: string, stock: number) {
  const res = await fetch(`/products/${productUUID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });
  return res.json();
}