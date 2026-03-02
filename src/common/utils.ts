export const validateBlobUrl = async (url: string): Promise<boolean> => {
  if (!url?.startsWith("blob:")) {
    return false;
  }
  try {
    await fetch(url);
    return true;
  } catch {
    return false;
  }
};

export const releaseMemoryVideo = (video: HTMLVideoElement) => {
  video.pause();
  video.removeAttribute("src"); // Remove source
  video.load(); // Reset video element

  // If using object URL, revoke it
  if (video.src?.startsWith("blob:")) {
    URL.revokeObjectURL(video.src);
  }
};

/**
 * Validate time format HH:MM:SS:mmm
 * Returns true if valid, false otherwise
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^(\d{1,2}):([0-5]\d):([0-5]\d):(\d{3})$/;
  return timeRegex.test(time);
};

/**
 * Convert time string (HH:MM:SS:mmm) to seconds
 * Example: "01:30:45:500" -> 5445.5
 */
export const timeToSeconds = (time: string): number => {
  if (!isValidTimeFormat(time)) {return 0;}

  const parts = time.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  const milliseconds = parseInt(parts[3], 10);

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

/**
 * Convert seconds to time string (HH:MM:SS:mmm)
 * Example: 5445.5 -> "01:30:45:500"
 */
export const secondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(Math.round((totalSeconds % 1) * 1000));

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
};

/**
 * Convert seconds to compact time string (removes leading zeros)
 * Always shows seconds and milliseconds
 * Example: 
 * - 5445.5 -> "1:30:45.500"
 * - 125.0 -> "2:05.000"
 * - 45.5 -> "45.500"
 * - 5.123 -> "5.123"
 */
export const secondsToTimeCompact = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(Math.round((totalSeconds % 1) * 1000));

  const parts: string[] = [];

  // Add hours only if not zero
  if (hours > 0) {
    parts.push(String(hours));
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(seconds).padStart(2, "0"));
  } else if (minutes > 0) {
    // Add minutes only if not zero (and hours is zero)
    parts.push(String(minutes));
    parts.push(String(seconds).padStart(2, "0"));
  } else {
    // Only seconds (no hours, no minutes)
    parts.push(String(seconds));
  }

  let result = parts.join(":");

  // Always add milliseconds
  result += `.${String(milliseconds).padStart(3, "0")}`;

  return result;
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) {return "0s";}
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (mins > 0) {
    parts.push(`${mins}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join("");
};

export const formatBitrate = (kbps: number): string => {
  if (kbps >= 1000) {return `${(kbps / 1000).toFixed(1)} Mbps`;}
  return `${kbps} kbps`;
};

/**
 * Format seconds to MM:SS.S format for video trimming
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms}`;
};

