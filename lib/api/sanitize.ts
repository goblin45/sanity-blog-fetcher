const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SCRIPT_TAG_PATTERN = /<\/?script\b[^>]*>/gi;

/**
 * Sanitizes a single string: trims whitespace, strips control characters,
 * and removes script tags. Does not replace a full HTML sanitizer for rich text.
 *
 * @param value - Raw string from a client payload.
 * @returns Sanitized string.
 */
export function sanitizeString(value: string): string {
  return value.replace(CONTROL_CHARS_PATTERN, '').replace(SCRIPT_TAG_PATTERN, '').trim();
}

/**
 * Recursively sanitizes POST/PUT (and similar) request payloads.
 * Strings are cleaned; arrays and plain objects are walked; other primitives are returned as-is.
 *
 * @param value - Parsed JSON body, form fields object, or nested value.
 * @returns A deep-sanitized copy suitable for validation and controller input.
 */
export function sanitizeInput<T>(value: T): T {
  if (typeof value === 'string') {
    return sanitizeString(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInput(item)) as T;
  }

  if (value !== null && typeof value === 'object' && value.constructor === Object) {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[sanitizeString(key)] = sanitizeInput(nested);
    }
    return result as T;
  }

  return value;
}
