export async function getSettings() {
  const res = await fetch("/settings");
  return res.json();
}

export async function saveSettings(data: any) {
  const res = await fetch("/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}