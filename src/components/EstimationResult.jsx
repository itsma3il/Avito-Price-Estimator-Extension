export default function EstimationResult({ estimation, onClose }) {
    if (!estimation) return null;
  
    if (estimation.error) {
      return (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-red-600 text-sm">{estimation.error}</span>
          </div>
          <button
            onClick={onClose}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Close
          </button>
        </div>
      );
    }
  
    const listedPrice = parseInt(estimation.listedPrice) || 0;
    const estimatedPrice = parseInt(estimation.estimatedPrice) || 0;
    const difference = listedPrice - estimatedPrice;
    const percentDiff = Math.round((difference / estimatedPrice) * 100);
  
    const isGoodDeal = difference <= 0;
    const differenceColor = isGoodDeal ? 'text-green-600' : 'text-red-600';
    const differenceText = isGoodDeal ? 'Good deal' : 'Overpriced';
  
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Estimation Result</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Estimated Value:</span>
            <span className="text-sm font-semibold">
              {estimatedPrice.toLocaleString()} MAD
            </span>
          </div>
  
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Confidence:</span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${estimation.confidence}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {estimation.confidence}%
              </span>
            </div>
          </div>
  
          {listedPrice > 0 && (
            <>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Listed Price:</span>
                  <span className="text-sm font-semibold">
                    {listedPrice.toLocaleString()} MAD
                  </span>
                </div>
  
                <div className={`flex justify-between mt-2 ${differenceColor}`}>
                  <span className="text-sm">{differenceText}:</span>
                  <span className="text-sm font-semibold">
                    {Math.abs(difference).toLocaleString()} MAD (
                    {Math.abs(percentDiff)}%)
                  </span>
                </div>
              </div>
  
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  {isGoodDeal ? (
                    <span className="text-green-600">
                      This appears to be a good deal compared to market value
                    </span>
                  ) : (
                    <span className="text-red-600">
                      This appears to be overpriced compared to market value
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
  
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
          Powered by Car Price Estimator
        </div>
      </div>
    );
  }