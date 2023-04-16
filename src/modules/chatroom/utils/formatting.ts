/**
 * Format a Date relative to the current time, in a human-readable way
 * @param date
 */
export const formatTime = (date: Date) => {
  const millis = new Date().getTime() - date.getTime();
  
  const minutes = Math.round(millis / 1_000 / 60);
  if (minutes < 1)
    return "Just now";
  
  if (minutes < 64)
    return minutes + " minutes ago";
  
  if (minutes < 24 * 60)
    return date.toLocaleTimeString();
  
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * Should be used before consuming key names from events, because some browsers (InternetExplorer and Edge) use different naming
 * conventions for some keys
 * @param key
 */
export const prepareKey = (key: string) => {
  switch (key) {
    case "Down":
      return "ArrowDown";
    case "Up":
      return "ArrowUp";
    case "Left":
      return "ArrowLeft";
    case "Right":
      return "ArrowRight";
    case "Esc":
      return "Escape";
    default:
      return key;
  }
}
