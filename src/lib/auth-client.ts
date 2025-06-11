import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  email: string;
  exp: number;
}

// Client-side authentication check
export function isAuthenticatedClient() {
  const token = getCookie('access_token');
  console.log('Checking access_token cookie:', token);
  
  if (!token) {
    console.log('No access_token found in cookies');
    return false;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token as string);
    console.log('Successfully decoded token:', decoded);
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
}

// Get auth token (client-side)
export function getAuthTokenClient() {
  const token = getCookie('access_token');
  console.log('Getting access_token:', token);
  return token;
}

// Get user role from token
export function getUserRole(): string | null {
  try {
    const token = getAuthTokenClient();
    if (!token) {
      console.log('No token found when getting role');
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token as string);
    console.log('Decoded token for role check:', decoded);
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token for role:', error);
    return null;
  }
}

// Check if user has specific role
export function hasRole(role: string): boolean {
  const userRole = getUserRole();
  console.log('Checking role:', { userRole, requiredRole: role });
  return userRole === role;
}

// Get user email from token
export function getUserEmail(): string | null {
  try {
    const token = getAuthTokenClient();
    if (!token) {
      console.log('No token found when getting email');
      return null;
    }
    
    const decoded = jwtDecode<DecodedToken>(token as string);
    console.log('Decoded token for email:', decoded);
    return decoded.email;
  } catch (error) {
    console.error('Error decoding token for email:', error);
    return null;
  }
} 