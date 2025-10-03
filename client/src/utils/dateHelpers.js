// ISO <-> input datetime-local dönüşüm fonksiyonları
export function isoToLocalInput(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${min}`;
}

export function localInputToIso(localString) {
  if (!localString) return "";
  const d = new Date(localString);
  // Saniye ve milisaniye ekle, UTC'ye çevir
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
