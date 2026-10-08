export function generateIncidentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CSA-${year}-${randomNum}`;
}
