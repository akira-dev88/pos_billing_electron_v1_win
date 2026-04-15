const API_URL = "http://localhost:8000";

export async function getProfile() {
  const res = await fetch(`${API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
}