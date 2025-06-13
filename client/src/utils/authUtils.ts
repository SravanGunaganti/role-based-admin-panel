import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
  role?: string;
  email?: string;
  id?: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}

export async function isTokenValidBackend(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return res.ok && data.valid;
  } catch {
    return false;
  }
}
