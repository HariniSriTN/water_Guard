/**
 * Format numbers with Indian & International readable formats.
 * e.g., 100000 -> "1,00,000 L" (or customizable)
 */
export function formatLiters(value: number, includeUnit: boolean = true): string {
  if (value === undefined || value === null || isNaN(value)) {
    return includeUnit ? '0 L' : '0';
  }
  
  // Format with standard locale string
  const formatted = Math.round(value).toLocaleString('en-IN');
  return includeUnit ? `${formatted} L` : formatted;
}

export function formatCompactLiters(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0 L';
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M L`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k L`;
  }
  return `${Math.round(value)} L`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatPressure(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0 Bar';
  return `${value.toFixed(1)} Bar`;
}

export function getStatusBadge(status: 'normal' | 'warning' | 'abnormal') {
  switch (status) {
    case 'abnormal':
      return {
        label: 'Abnormal',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900',
        dotColor: 'bg-rose-500',
        iconEmoji: '🔴',
      };
    case 'warning':
      return {
        label: 'Warning',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
        dotColor: 'bg-amber-500',
        iconEmoji: '🟡',
      };
    case 'normal':
    default:
      return {
        label: 'Normal',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
        dotColor: 'bg-emerald-500',
        iconEmoji: '🟢',
      };
  }
}
