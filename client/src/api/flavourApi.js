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

export async function createFlavor(flavorData) {
  const response = await fetch(`${API_BASE_URL}/flavors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flavorData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.errors) {
      throw new Error(data.errors.join(" "));
    }

    throw new Error(data.error || "Failed to create flavor");
  }

  return data;
}

export async function submitFlavor(flavorId) {
  const response = await fetch(`${API_BASE_URL}/flavors/${flavorId}/submit`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit flavor");
  }

  return data;
}

export async function getSubmittedFlavors() {
  const response = await fetch(`${API_BASE_URL}/flavors?role=flavorist`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load submitted flavors");
  }

  return data;
}

export async function approveFlavor(flavorId, flavoristId) {
  const response = await fetch(`${API_BASE_URL}/flavors/${flavorId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flavoristId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to approve flavor");
  }

  return data;
}

export async function rejectFlavor(flavorId, flavoristId) {
  const response = await fetch(`${API_BASE_URL}/flavors/${flavorId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ flavoristId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to reject flavor");
  }

  return data;
}

export async function addFlavorComment(flavorId, createdById, text) {
  const response = await fetch(`${API_BASE_URL}/flavors/${flavorId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      createdById,
      text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add comment");
  }

  return data;
}