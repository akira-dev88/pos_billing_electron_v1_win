const BASE_URL = "http://127.0.0.1:8000";

export async function getSettings() {
  const res = await fetch(`${BASE_URL}/api/settings`);
  return res.json();
}

export async function saveSettings(data: any) {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}