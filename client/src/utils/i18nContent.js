export function getLocalized(obj, baseKey, lang) {
  if (!obj) return "";
  const isAr = (lang || "").toLowerCase().startsWith("ar");
  const arKey = `${baseKey}_ar`;
  if (isAr && obj[arKey]) return obj[arKey];
  if (!isAr && obj[baseKey]) return obj[baseKey];
  return obj[baseKey] || obj[arKey] || "";
}
