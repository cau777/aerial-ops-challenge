export const formatTime = (date: Date) => {
  const millis = new Date().getTime() - date.getTime();
  
  const minutes = Math.round(millis / 1_000 / 60);
  if (minutes < 1)
    return "Just now"
  
  if (minutes < 64)
    return minutes + " minutes ago";
  
  if (minutes < 24 * 60)
    return date.toLocaleTimeString();
  
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}