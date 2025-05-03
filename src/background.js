// Cache for storing API responses
const estimationCache = new Map();

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'estimateFromPage':
      handleEstimateFromPage(message.data, sendResponse);
      return true;
      
    case 'clearCache':
      estimationCache.clear();
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('Unknown background action:', message.action);
  }
});

async function handleEstimateFromPage(carData, sendResponse) {
  try {
    const cacheKey = generateCacheKey(carData);
    
    // Check cache first
    if (estimationCache.has(cacheKey)) {
      sendResponse(estimationCache.get(cacheKey));
      return;
    }
    
    // In a real implementation, this would call the actual API
    // For demo purposes, we'll simulate a response
    const mockEstimation = await simulateApiCall(carData);
    
    // Cache the result
    estimationCache.set(cacheKey, mockEstimation);
    
    sendResponse(mockEstimation);
  } catch (error) {
    console.error('Background estimation error:', error);
    sendResponse({ 
      error: 'Failed to estimate price',
      details: error.message 
    });
  }
}

function generateCacheKey(carData) {
  return `${carData.marke}-${carData.model}-${carData.year}-${carData.kilometrage}`;
}

async function simulateApiCall(carData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple mock estimation logic
      const basePrice = 80000;
      const age = new Date().getFullYear() - parseInt(carData.year || '2020');
      const km = parseInt(carData.kilometrage?.replace(/\D/g, '') || '100000');
      
      let estimatedPrice = basePrice;
      estimatedPrice -= age * 5000;
      estimatedPrice -= (km / 10000) * 2000;
      
      if (carData.type_boit === 'Automatique') estimatedPrice += 10000;
      if (carData.premiere_main === 'Oui') estimatedPrice += 5000;
      
      estimatedPrice = Math.max(estimatedPrice, 15000);
      
      resolve({
        estimatedPrice: Math.round(estimatedPrice),
        confidence: 85 - Math.min(age, 10) - Math.min(Math.floor(km / 50000), 10),
        listedPrice: parseInt(carData.price?.replace(/\D/g, '') || 0)
      });
    }, 800); // Simulate network delay
  });
}