/**
 * Returns a human-readable relative time string from an ISO date string.
 * Examples: "just now", "5m ago", "3h ago", "2d ago"
 */
export function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '';

  const now = Date.now();
  const then = new Date(isoString).getTime();
  if (isNaN(then)) return '';

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  // Fallback: short date
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns an absolute time string from an ISO date string.
 * Format: "YYYY-MM-DD, Timezone" (e.g. "2026-07-29, GMT+8")
 */
export function formatAbsoluteTime(isoString?: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}, UTC`;
}
