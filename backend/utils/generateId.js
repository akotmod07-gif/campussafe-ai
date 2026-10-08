let incidentCounter = 124;

function generateIncidentId() {
  incidentCounter += 1;
  const year = new Date().getFullYear();
  const paddedNumber = String(incidentCounter).padStart(5, '0');
  return `CSA-${year}-${paddedNumber}`;
}

module.exports = { generateIncidentId };
