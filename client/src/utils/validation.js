// src/utils/validation.js

/** Simple demo validation rules. Adjust if you get exact Sudan formats. */
export function validateNationalId(value) {
  // Example: 8–14 digits
  return /^\d{8,14}$/.test((value || "").trim());
}

export function validatePassport(value) {
  // Example: 1 letter + 7 digits (e.g., A1234567)
  return /^[A-Z]\d{7}$/i.test((value || "").trim());
}

export function last4(value) {
  const v = String(value || "");
  return v.slice(-4);
}

/** Browser-safe SHA-256 hashing (one-way) */
export async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
