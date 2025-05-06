import ReactDOM from 'react-dom/client';
import { useState, useEffect } from "react";
import ManualEstimateForm from "../components/ManualEstimateForm";
import EstimationResult from "../components/EstimationResult";
import LoadingSpinner from "../components/LoadingSpinner";
import { estimateCarPrice } from "../services/apiService";
import { validateCarData } from "../utils/validation";

function App() {
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Car Price Estimator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Get accurate market price estimates
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <ManualEstimateForm
              onSubmit={handleManualEstimate}
              currentUrl={currentUrl}
            />

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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
