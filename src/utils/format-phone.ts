/**
 * Format phone number: +998990330919 -> +998 99 033 09 19
 */
export function fPhoneNumber(phoneNumber: string | null | undefined): string {
  if (!phoneNumber) return '';

  const cleanNumber = phoneNumber.replace(/\D/g, '');

  if (cleanNumber.startsWith('998') && cleanNumber.length === 12) {
    return `+998 ${cleanNumber.substring(3, 5)} ${cleanNumber.substring(5, 8)} ${cleanNumber.substring(8, 10)} ${cleanNumber.substring(10, 12)}`;
  }

  // Fallback for other formats
  if (cleanNumber.length === 9) {
    return `+998 ${cleanNumber.substring(0, 2)} ${cleanNumber.substring(2, 5)} ${cleanNumber.substring(5, 7)} ${cleanNumber.substring(7, 9)}`;
  }

  return phoneNumber;
}
