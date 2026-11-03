/**
 * Indian Rupee (INR) Formatter
 * Formats numbers into currency format (e.g. ₹1,25,000.00)
 */
export function formatINR(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount || 0);
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Standard Date Formatter
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Category Color Palette for consistent UI badges and charts
 */
export const CATEGORY_COLORS = {
  Food: '#10b981', // Emerald
  Travel: '#3b82f6', // Blue
  Shopping: '#ec4899', // Pink
  Bills: '#f59e0b', // Amber
  Entertainment: '#8b5cf6', // Violet
  Health: '#ef4444', // Red
  Education: '#06b6d4', // Cyan
  Other: '#64748b', // Slate
};
