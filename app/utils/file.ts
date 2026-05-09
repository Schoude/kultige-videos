const units = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatFileSize(bytes: number): string {
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

export function getFileExtension(file: File) {
  const name = file.name;

  const lastDot = name.lastIndexOf('.');

  // No extension or hidden file like ".gitignore"
  if (lastDot <= 0) {
    return '';
  }

  return name.slice(lastDot + 1).toLowerCase();
}
