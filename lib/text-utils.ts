/**
 * Capitalizes only the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with only the first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 * @param str - The string to truncate
 * @param maxLength - The maximum length before truncation
 * @returns The truncated string with ellipsis if needed
 */
export function truncateText(str: string, maxLength: number): string {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
} 