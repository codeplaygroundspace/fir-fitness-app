import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for API requests
 * Handles both client and server-side environments
 * Throws an error in production if the base URL cannot be determined
 */
export function getBaseUrl(): string {
  // Check for explicitly set base URL first
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // In the browser, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // In development, fallback to localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // In production, if we get here, something is wrong
  throw new Error(
    'Unable to determine base URL. Please set NEXT_PUBLIC_BASE_URL environment variable in production.'
  );
}
