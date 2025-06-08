/**
 * Storage utility functions for handling localStorage operations
 */

type StorageKey = 'theme' | 'user_preferences' | 'auth_token';

/**
 * Get a value from localStorage
 * @param key - The key to retrieve
 * @param defaultValue - The default value to return if the key doesn't exist
 * @param parseJson - Whether to parse the value as JSON (default: true)
 * @returns The stored value or the default value
 */
export function getStorageItem<T>(key: StorageKey, defaultValue: T, parseJson: boolean = true): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return parseJson ? JSON.parse(item) : item as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set a value in localStorage
 * @param key - The key to store the value under
 * @param value - The value to store
 * @param stringify - Whether to stringify the value as JSON (default: true)
 */
export function setStorageItem<T>(key: StorageKey, value: T, stringify: boolean = true): void {
  if (typeof window === 'undefined') return;
  
  try {
    const valueToStore = stringify ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

/**
 * Remove a value from localStorage
 * @param key - The key to remove
 */
export function removeStorageItem(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
} 