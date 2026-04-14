export async function getStaff() {
  const res = await fetch("/staff");
  return res.json();
}

export async function createStaff(data: any) {
  const res = await fetch("/staff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}