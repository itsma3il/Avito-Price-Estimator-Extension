import { extractCarDataFromDOM } from './utils/scraper';
import { createEstimationDisplay } from './utils/displayUtils';

// Main content script execution
(async function() {
  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Add estimate button to page if on car listing
  if (isCarListingPage()) {
    addEstimateButton();
  }
})();

function isCarListingPage() {
  return (
    window.location.href.includes('avito.ma') &&
    document.querySelector('p.jdRkSM') &&
    document.querySelector('div.dnArJl')
  );
}

function handleMessage(message, sender, sendResponse) {
  switch (message.action) {
    case 'extractCarData':
      handleExtractData(sendResponse);
      return true;
      
    case 'displayEstimation':
      handleDisplayEstimation(message.estimation);
      sendResponse({ success: true });
      break;
      
    default:
      console.warn('Unknown message action:', message.action);
  }
}

function handleExtractData(sendResponse) {
  try {
    const data = extractCarDataFromDOM();
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Could not extract car data from page');
    }
    sendResponse({ data });
  } catch (error) {
    console.error('Data extraction error:', error);
    sendResponse({ error: error.message });
  }
}

function handleDisplayEstimation(estimation) {
  try {
    const display = createEstimationDisplay(estimation);
    const priceElement = document.querySelector('p.jdRkSM');
    
    if (priceElement) {
      const existingDisplay = document.getElementById('car-estimator-display');
      if (existingDisplay) existingDisplay.remove();
      
      priceElement.parentNode.insertBefore(display, priceElement);
    }
  } catch (error) {
    console.error('Display error:', error);
  }
}

function addEstimateButton() {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'estimator-button-container';
  
  const button = document.createElement('button');
  button.className = 'estimator-button';
  button.textContent = 'Estimate Market Price';
  
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Estimating...';
    
    try {
      const data = extractCarDataFromDOM();
      const estimation = await chrome.runtime.sendMessage({
        action: 'estimateFromPage',
        data
      });
      
      handleDisplayEstimation(estimation);
    } catch (error) {
      console.error('Estimation failed:', error);
    } finally {
      button.textContent = 'Estimate Market Price';
      button.disabled = false;
    }
  });
  
  buttonContainer.appendChild(button);
  
  const priceSection = document.querySelector('.sc-iqcoie'); // Adjust selector as needed
  if (priceSection) {
    priceSection.appendChild(buttonContainer);
  }
}