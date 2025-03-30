// formatTime.ts
/**
 * Format a time in seconds to HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = secs.toString().padStart(2, '0');
  
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Format a time in seconds to a verbose format (e.g., "2 hours 30 minutes")
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTimeVerbose(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours} hour${hours !== 1 ? 's' : ''} `;
  }
  
  if (minutes > 0 || hours === 0) {
    result += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
  }
  
  if (secs > 0 && hours === 0) {
    result += `${secs} second${secs !== 1 ? 's' : ''}`;
  }
  
  return result.trim();
}

export default formatTimeVerbose;
