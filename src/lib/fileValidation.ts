export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function getFileAcceptString(allowedTypes: string[]): string {
  return allowedTypes.join(',');
}

export const ALLOWED_IMAGES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_RECEIPTS = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
