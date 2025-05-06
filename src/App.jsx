import { useState, useEffect } from "react";
import { estimateCarPrice } from "./services/apiService";
import ManualEstimateForm from "./components/ManualEstimateForm";
import EstimationResult from "./components/EstimationResult";
import LoadingSpinner from "./components/LoadingSpinner";
import { validateCarData } from "./utils/validation";

function App() {
  const [activeTab, setActiveTab] = useState("manual");
  const [estimation, setEstimation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const handleManualEstimate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const validationErrors = validateCarData(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      const result = await estimateCarPrice(formData);
      setEstimation(result);
    } catch (err) {
      console.error("Estimation error:", err);
      setError(err.message || "Failed to estimate price");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteEstimate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) throw new Error("No active tab found");

      try {
        await chrome.tabs.sendMessage(tab.id, { action: "ping" });
      } catch (error) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await chrome.tabs.sendMessage(tab.id, { action: "ping" });
      }

      // Get car data
      const { data, error: extractionError } = await chrome.tabs.sendMessage(
        tab.id,
        { action: "extractCarData" }
      );
      if (extractionError){
        setError(extractionError);
        return;
      };

      // Get estimation
      const estimation = await chrome.runtime.sendMessage({
        action: "estimateFromPage",
        data,
      });
      if (estimation.error) {
        setError(estimation.error);
        return;
      }

      // Display results
      setEstimation(estimation);
      if(!estimation) {
        setError("APP.jsx -> No estimation data found");
        return;
      }
      
      await chrome.tabs.sendMessage(tab.id, {
        action: "displayEstimation",
        estimation,
      });
      setEstimation(estimation);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const openStandalonePage = () => {
    const url = chrome.runtime.getURL('src/standalone/index.html');
    chrome.tabs.create({ url });
  };
  return (
    <div className="w-[400px] min-h-[400px] bg-gray-50 p-4">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-center">
          Car Price Estimator
        </h1>
        <button onClick={()=>openStandalonePage()}>
          to standalone test
        </button>
        <p className="text-xs text-gray-500 text-center mt-1">
          Get accurate market price estimates
        </p>
      </header>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`flex-1 py-2 font-medium text-sm ${
            activeTab === "manual"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Estimate
        </button>
        <button
          className={`flex-1 py-2 font-medium text-sm ${
            activeTab === "website"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("website")}
        >
          Website Estimate
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {activeTab === "manual" ? (
            <ManualEstimateForm
              onSubmit={handleManualEstimate}
              currentUrl={currentUrl}
            />
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleWebsiteEstimate}
                disabled={!currentUrl.includes("avito.ma")}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  currentUrl.includes("avito.ma")
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Estimate Current Listing
              </button>
              {!currentUrl.includes("avito.ma") && (
                <p className="text-sm text-gray-500 text-center">
                  Navigate to an avito.ma car listing to use this feature
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {estimation && (
            <div className="mt-4">
              <EstimationResult
                estimation={estimation}
                onClose={() => setEstimation(null)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
