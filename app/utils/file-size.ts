export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let value = bytes;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return (
    new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 2,
    }).format(value)
    + ' '
    + units[unitIndex]
  );
}
