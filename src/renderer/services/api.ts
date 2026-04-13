const BASE_URL = "http://127.0.0.1:8000/api";

export async function apiPost(url: string, body: any) {
  const token = localStorage.getItem("token");

  console.log("🔐 TOKEN:", token);
  console.log("📡 POST:", url);

  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log("📥 RESPONSE:", data);

  return data;
}

export async function apiGet(url: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return res.json();
}