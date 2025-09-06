import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAge(dateString) {
  if (!dateString) return 0;
  const dob = new Date(dateString);
  const now = new Date();
  const diff = now - dob;
  return diff / (365.25 * 24 * 60 * 60 * 1000);
}

// Validate work times: must be 06:00–22:00 and start < end
export function isValidWorkTime(start, end) {
  if (!start || !end) return true;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;

  const min = 6 * 60; // 6 AM
  const max = 22 * 60; // 10 PM

  return startMins >= min && endMins <= max && startMins < endMins;
}