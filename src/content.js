import { extractCarDataFromDOM } from "./utils/scraper";
import { createEstimationDisplay } from "./utils/displayUtils";

console.log("Content script loaded!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleAsync = async () => {
    try {
      switch (message.action) {
        case "ping":
          sendResponse({ status: "alive" });
          break;

        case "extractCarData":
          var carData = extractCarDataFromDOM();
          if (carData) {
            sendResponse({ data: carData });
          } else {
            sendResponse({ error: "No car data found" });
          }
          break;
        case "displayEstimation":
          var estimation = message.estimation;
          if (estimation) {
            displayEstimation(estimation);
            sendResponse({ success: true });
          } else {
            sendResponse({ error: "No estimation data provided" });
          }
          break;
        default:
          console.warn("Unknown background action:", message.action);
          sendResponse({ error: "Unknown action" });
      }
    } catch (error) {
      console.error("Background error:", error);
      sendResponse({ error: error.message });
    }
  };
  handleAsync();
  return true; // Keep message port open
});

function displayEstimation(estimation) {
  if (typeof estimation !== "object" || estimation === null) {
    console.warn("Invalid estimation object:", estimation);
    return;
  }

  const existingDisplay = document.getElementById("car-estimator-display");
  const container = document.querySelector("div.sc-1g3sn3w-4.etbZjx"); // Fix selector spacing

  if (!container) {
    console.error("Target container for estimation display not found.");
    return;
  }

  if (existingDisplay) {
    existingDisplay.remove();
  }

  const displayElement = createEstimationDisplay(estimation);
  container.insertBefore(displayElement, container.children[1]);
}

async function injectEstimateButton() {
  const priceSection = document.querySelector("div.sc-1g3sn3w-4.etbZjx");
  if (!priceSection.querySelector(".estimator-button")) {
    const button = document.createElement("button");
    button.className = "estimator-button";
    button.textContent = "Estimate Market Price";

    button.onclick = async () => {
      button.disabled = true;
      try {
        const data = extractCarDataFromDOM();
        const estimation = await chrome.runtime.sendMessage({
          action: "estimateFromPage",
          data,
        });
        displayEstimation(estimation);
      } catch (error) {
        console.error("Estimation failed:", error);
      } finally {
        button.disabled = false;
      }
    };
    if (priceSection) {
      priceSection.insertBefore(button, priceSection.children[1]);
    }
  }
}
injectEstimateButton();

const css = `
  /* Paste your content.css here directly */
  
.estimator-button-container {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .estimator-button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }
  
  .estimator-button:hover {
    background-color: #2563eb;
  }
  
  .estimator-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  
  .estimator-display {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .estimator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .estimator-header h3 {
    font-weight: 600;
    font-size: 1rem;
    color: #1e293b;
    margin: 0;
  }
  
  .estimator-confidence {
    background-color: #e0f2fe;
    color: #0369a1;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: 500;
  }
  
  .estimator-price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .estimator-price-row span {
    color: #64748b;
  }
  
  .estimator-price-row strong {
    color: #1e293b;
    font-weight: 600;
  }
  
  .estimator-difference {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    font-weight: 500;
  }
  
  .estimator-good-deal {
    color: #16a34a;
  }
  
  .estimator-overpriced {
    color: #dc2626;
  }
  
  .estimator-footer {
    margin-top: 0.75rem;
    text-align: right;
    font-size: 0.75rem;
    color: #94a3b8;
  }
  
  .estimator-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #dc2626;
    font-size: 0.875rem;
  }
  
  .estimator-error-icon {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }
`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);
