/**
 * Format time in seconds to hours, minutes, and seconds
 */
export function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  
  return { hours, minutes, remainingSeconds };
}

/**
 * Format time in seconds to a display string
 */
export function formatTimeDisplay(totalSeconds: number) {
  const { hours, minutes, remainingSeconds } = formatTime(totalSeconds);
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return hours > 0
    ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Format time in seconds to a verbose string
 */
export function formatTimeVerbose(totalSeconds: number) {
  const { hours, minutes, remainingSeconds } = formatTime(totalSeconds);
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours} hour${hours !== 1 ? 's' : ''} `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
  }
  
  result += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  
  return result;
}