const BASE_URL = "http://127.0.0.1:8000/api";

export async function apiPost(url: string, body: any) {
  const res = await fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
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