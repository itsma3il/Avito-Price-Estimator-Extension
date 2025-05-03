const API_BASE_URL = import.meta.env.API_BASE_URL || "";
const API_KEY = import.meta.env.API_KEY || "";

/**
 * Estimate car price using API
 * @param {Object} carData - Car details for estimation
 * @returns {Promise<Object>} - Estimation result
 */
export async function estimateCarPrice(carData) {
  try {
    const response = await fetch(`${API_BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` //await getApiKey()
      },
      body: JSON.stringify(normalizeCarData(carData))
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Normalize car data for API request
 * @param {Object} data - Raw car data
 * @returns {Object} - Normalized car data
 */
function normalizeCarData(data) {
  return {
    year: parseInt(data.year) || null,
    transmission: data.type_boit || 'unknown',
    fuelType: data.type_carburant || 'unknown',
    mileage: parseInt(data.kilometrage?.replace(/\D/g, '') || 0),
    make: data.marke || 'unknown',
    model: data.model || 'unknown',
    power: parseInt(data.puissance?.match(/\d+/)?.[0] || 0),
    isFirstHand: data.premiere_main === 'Oui',
    doors: parseInt(data.Nombre_doors) || 5,
    location: data.city || 'unknown',
    listedPrice: parseInt(data.price?.replace(/\D/g, '') || 0)
  };
}