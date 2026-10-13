/**
 * Formats ISO date string to readable format e.g. "14 Oct 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateString;
  }
}

/**
 * Formats ISO date string to readable date & time e.g. "14 Oct 2026, 04:30 PM"
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}

/**
 * Calculates days remaining until due date. Negative indicates overdue days.
 */
export function getDaysRemaining(dueDateString: string): number {
  try {
    const due = new Date(dueDateString);
    const now = new Date();
    // Reset hours for pure day comparison
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Checks if a loan is due within 7 days.
 */
export function isDueSoon(dueDateString: string): boolean {
  const days = getDaysRemaining(dueDateString);
  return days >= 0 && days <= 7;
}

/**
 * Checks if a loan is past due date.
 */
export function isOverdue(dueDateString: string): boolean {
  return getDaysRemaining(dueDateString) < 0;
}
