import { parse } from "dotenv";

const API_BASE_URL = "http://127.0.0.1:8000";
const API_KEY = 'mysecretkey123';

/**
 * Estimate car price using API
 * @param {Object} carData - Car details for estimation
 * @returns {Promise<Object>} - Estimation result
 */
export async function estimateCarPrice(carData) {
  try {
    const payload =  normalizeCarData(carData);
    console.log("API-service -> Sending request to:", `${API_BASE_URL}/estimate`);
    console.log("API-service -> With data:", JSON.stringify(payload, null, 2));
    const response = await fetch(`http://127.0.0.1:8000/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': `mysecretkey123` 
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(`Failed to connect to API: ${error.message}`);
  }
}

/**
 * Normalize car data for API request
 * @param {Object} data - Raw car data
 * @returns {Object} - Normalized car data
 */
export function normalizeCarData(data) {
  let kilometrage = 0;
  if (typeof data.kilometrage === "string" && data.kilometrage.includes("-")) {
    const [min, max] = data.kilometrage
      .split("-")
      .map(val => parseInt(val.replace(/\D/g, '')));
    kilometrage = Math.round((min + max) / 2);
  } else {
    kilometrage = parseInt(data.kilometrage) || 0;
  }
  let premiere_main_value = 1;
  const main = data.premiere_main?.toLowerCase();
  if (main === "non") premiere_main_value = 0;
  else if (main === "oui") premiere_main_value = 2;

  return {
    year: parseInt(data.year) || 2000,
    type_boit: data.type_boit?.toLowerCase() || 'manuelle',
    type_carburant: data.type_carburant?.toLowerCase() || 'essence',
    kilometrage,
    marke: data.marke?.toLowerCase() || 'unknown',
    model: data.model?.toLowerCase() || 'unknown',
    puissance: data.puissance ? parseInt(data.puissance.toString().match(/\d+/)?.[0]) : null,
    premiere_main: premiere_main_value,
    Nombre_doors: parseInt(data.Nombre_doors) || 5,
    city: data.city?.toLowerCase() || 'unknown',
    price: data.price ? parseInt(data.price.toString().replace(/\D/g, '')) : 0,
    url: data.url || null
  };
}