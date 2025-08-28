export function validateNationalId(value) {
  return /^\d{8,14}$/.test((value || "").trim());
}

export function validatePassport(value) {
  return /^[A-Z]\d{7}$/i.test((value || "").trim());
}

export function last4(value) {
  const v = String(value || "");
  return v.slice(-4);
}

export async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
