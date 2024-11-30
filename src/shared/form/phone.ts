import invariant from "@/invariant";

/**
 * Formats a phone number string into a Korean phone number format
 * @param value The input phone number string
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(value: string): string {
  // Remove any non-digit characters
  const cleaned = value.replace(/\D/g, "");

  invariant(
    cleaned.length <= 11,
    "전화번호는 11자 이하여야 합니다 : " + cleaned,
  );

  if (cleaned.startsWith("02")) {
    if (cleaned.length <= 5)
      return cleaned.replace(/(\d{2})(\d{1,3})/, "$1-$2");
    if (cleaned.length <= 9)
      return cleaned.replace(/(\d{2})(\d{3})(\d{1,4})/, "$1-$2-$3");
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (cleaned.length <= 7) {
    return cleaned.replace(/(\d{3})(\d{1,4})/, "$1-$2");
  }

  if (cleaned.length <= 9) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{1,3})/, "$1-$2-$3");
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
}
