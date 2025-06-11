import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  email: string;
  exp: number;
}

// Server-side authentication check
export async function isAuthenticatedServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token.value);
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
}

// Get auth token (server-side)
export async function getAuthTokenServer() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

// Get user role from token (server-side)
export async function getUserRoleServer() {
  try {
    const token = await getAuthTokenServer();
    if (!token) {
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token for role:', error);
    return null;
  }
}

// Check if user has specific role (server-side)
export async function hasRoleServer(role: string): Promise<boolean> {
  const userRole = await getUserRoleServer();
  return userRole === role;
} 