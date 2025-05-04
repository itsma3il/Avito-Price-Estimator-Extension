import { estimateCarPrice } from "./services/apiService";

// Cache for storing API responses
const estimationCache = new Map();


chrome.runtime.onInstalled.addListener(() => {
  console.log('Service worker activated');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleAsync = async () => {
    try {
      switch (message.action) {
        case 'ping':
          sendResponse({ status: 'alive' });
          break;

        case 'estimateFromPage':
          var result = await handleEstimateFromPage(message.data);
          sendResponse(result);
          break;
          
        case 'clearCache':
          estimationCache.clear();
          sendResponse({ success: true });
          break;
          
        default:
          console.warn('Unknown background action:', message.action);
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background error:', error);
      sendResponse({ error: error.message });
    }
  };
  handleAsync();
  return true; // Keep message port open
});

async function handleEstimateFromPage(carData) {
  try {
    const cacheKey = generateCacheKey(carData);
    
    if (estimationCache.has(cacheKey)) {
      return estimationCache.get(cacheKey);
    }
    
    const mockEstimation = await estimateCarPrice(carData);
    console.log('[background] -> Estimation result:', mockEstimation);
    estimationCache.set(cacheKey, mockEstimation);
    
    return mockEstimation;
  } catch (error) {
    console.error('Estimation failed:', error);
    throw error;
  }
}

function generateCacheKey(carData) {
  return `${carData.marke}-${carData.model}-${carData.year}-${carData.kilometrage}`;
}
