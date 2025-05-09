import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  TruckIcon,
  ChartBarIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "./components/LoadingSpinner";
import EstimationResult from "./components/EstimationResult";

function App() {
  const [estimation, setEstimation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupportedPage, setIsSupportedPage] = useState(false);

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        setIsSupportedPage(
          url.includes("avito.ma") && !url.includes("voitures_d_occasion-")
        );
      }
    });
  }, []);

  const handleWebsiteEstimate = async () => {
    if (!isSupportedPage) return;

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
        await chrome.scripting.executeScript({
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
      if (extractionError) {
        setError(extractionError);
        return;
      }

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
      if (!estimation) {
        setError("Unable to generate estimation");
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
    const url = chrome.runtime.getURL("src/standalone/index.html");
    chrome.tabs.create({ url });
  };

  const resetEstimation = () => {
    setEstimation(null);
    setError(null);
  };

  return (
    <div className="w-[380px] min-h-[500px] bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col">
      <header className="mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <TruckIcon className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Car Price Estimator
          </h1>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Get accurate market price estimates for cars on Avito.ma
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <Transition
            show={!estimation}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="space-y-5">
              <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">
                    Manual Estimate
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter car details manually to get a price estimation
                </p>
                <button
                  onClick={openStandalonePage}
                  className="w-full py-2.5 px-4 rounded-md text-blue-700 font-medium border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                >
                  <span>Open Manual Estimator</span>
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <CheckBadgeIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">
                    Instant Estimate
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isSupportedPage
                    ? "Get an instant price estimate for the current car listing"
                    : "Navigate to an Avito.ma car listing to use this feature"}
                </p>
                <button
                  onClick={handleWebsiteEstimate}
                  disabled={!isSupportedPage}
                  className={`w-full py-2.5 px-4 rounded-md text-white font-medium flex items-center justify-center transition-colors duration-200 ${
                    isSupportedPage
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-300"
                  }`}
                >
                  <span>Estimate Current Listing</span>
                </button>
              </div>
            </div>
          </Transition>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
                <button
                  className="ml-auto flex-shrink-0 text-red-400 hover:text-red-500"
                  onClick={() => setError(null)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          <Transition
            show={estimation !== null}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div>
              <div className="mt-4">
                <EstimationResult
                  estimation={estimation}
                  onClose={resetEstimation}
                />
              </div>
              <button
                onClick={resetEstimation}
                className="mt-4 flex items-center justify-center text-sm text-gray-600 hover:text-blue-600 mx-auto"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Start New Estimation
              </button>
            </div>
          </Transition>
        </div>
      )}

      <footer className="mt-auto pt-4 text-center text-xs text-gray-500">
        Car Price Estimator Pro © 2025
      </footer>
    </div>
  );
}

export default App;
