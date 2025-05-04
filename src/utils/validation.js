/**
 * Validate car data before estimation
 * @param {Object} data - Car data to validate
 * @returns {string[]} - Array of error messages
 */
export function validateCarData(data) {
  const errors = [];

  if (!data.year || isNaN(data.year)) {
    errors.push("Valid year is required");
  }

  if (!data.marke) {
    errors.push("Car make is required");
  }

  if (!data.model) {
    errors.push("Car model is required");
  }

  if (!data.kilometrage || isNaN(data.kilometrage.replace(/\D/g, ""))) {
    errors.push("Valid mileage is required");
  }

  if (!data.type_carburant) {
    errors.push("Fuel type is required");
  }

  return errors;
}

/**
 * Validate estimation response from API
 * @param {Object} response - API response
 * @returns {boolean}
 */
export function validateEstimationResponse(response) {
  return (
    response &&
    typeof response === "object" &&
    "estimatedPrice" in response &&
    "confidence" in response
  );
}
