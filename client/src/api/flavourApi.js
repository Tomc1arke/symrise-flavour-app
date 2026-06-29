const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function getCustomerFlavors(userId) {
  const response = await fetch(
    `${API_BASE_URL}/flavors?role=customer&userId=${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load flavors");
  }

  return data;
}