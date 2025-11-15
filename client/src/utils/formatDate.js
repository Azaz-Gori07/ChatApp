/**
 * Format timestamp for chat bubbles or sidebar items
 * 
 * Examples:
 *  - Today: "3:45 PM"
 *  - Yesterday: "Yesterday"
 *  - Older: "12 Jan" or "12 Jan 2024"
 */

export const formatTime = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();

  const diff = today - date;

  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    return formatTime(isoDate); // Today
  }

  if (diff < oneDay * 2) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
};
