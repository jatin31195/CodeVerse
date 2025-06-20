import { BASE_URL } from "../config";
export const refreshAccessToken = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to refresh token');
  }

  return data.accessToken; 
};
