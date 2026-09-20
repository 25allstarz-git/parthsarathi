/**
 * Utility functions for mobile phone formatting, validation, and masking.
 */

/**
 * Normalizes user input into E.164 phone format (+91XXXXXXXXXX).
 * Accepts 10 digits ("9876543210"), with 0 ("09876543210"), or international ("+919876543210").
 */
export function formatPhoneNumber(input: string): string {
  const cleaned = input.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return digits.length > 0 ? `+${digits}` : "";
}

/**
 * Validates whether the formatted phone is a valid 10-digit Indian mobile number (+91[6-9]XXXXXXXXX)
 * or a general valid E.164 phone number.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  if (formatted.startsWith("+91")) {
    return /^\+91[6-9]\d{9}$/.test(formatted);
  }
  return /^\+[1-9]\d{9,14}$/.test(formatted);
}

/**
 * Masks phone number for display, e.g. "+91 ••••• ••1234"
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "+91 ••••• •••••";
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const last4 = digits.slice(-4);
    return `+91 ••••• ••${last4}`;
  }
  return phone;
}
