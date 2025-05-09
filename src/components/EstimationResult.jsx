import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  XMarkIcon, 
  TagIcon,
  ScaleIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

export default function EstimationResult({ estimation, onClose }) {
  if (!estimation) return null;

  if (estimation.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Estimation Error</h3>
            <p className="mt-1 text-sm text-red-600">{estimation.error}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 text-red-400 hover:text-red-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const listedPrice = parseInt(estimation.price) || 0;
  const estimatedPrice = parseInt(estimation.estimatedPrice) || 0;
  const difference = listedPrice - estimatedPrice;
  const percentDiff = Math.round((difference / estimatedPrice) * 100);

  const isGoodDeal = difference <= 0;
  const dealLevel = Math.abs(percentDiff);
  
  // Determine deal assessment level
  let dealAssessment;
  let dealColor;
  let DealIcon;

  if (isGoodDeal) {
    if (dealLevel >= 15) {
      dealAssessment = "Excellent Deal";
      dealColor = "text-green-700 bg-green-50";
      DealIcon = CheckCircleIcon;
    } else if (dealLevel >= 5) {
      dealAssessment = "Good Deal";
      dealColor = "text-green-600 bg-green-50";
      DealIcon = CheckCircleIcon;
    } else {
      dealAssessment = "Fair Price";
      dealColor = "text-blue-600 bg-blue-50";
      DealIcon = ScaleIcon;
    }
  } else {
    if (dealLevel >= 15) {
      dealAssessment = "Significantly Overpriced";
      dealColor = "text-red-700 bg-red-50";
      DealIcon = XCircleIcon;
    } else if (dealLevel >= 5) {
      dealAssessment = "Overpriced";
      dealColor = "text-red-600 bg-red-50";
      DealIcon = ExclamationTriangleIcon;
    } else {
      dealAssessment = "Slightly Overpriced";
      dealColor = "text-orange-600 bg-orange-50";
      DealIcon = ExclamationTriangleIcon;
    }
  }

  // Determine confidence level appearance
  let confidenceColor;
  if (estimation.confidence >= 80) {
    confidenceColor = "bg-green-600";
  } else if (estimation.confidence >= 60) {
    confidenceColor = "bg-blue-600";
  } else if (estimation.confidence >= 40) {
    confidenceColor = "bg-yellow-500";
  } else {
    confidenceColor = "bg-red-500";
  }

  return (
    <Transition
      show={true}
      appear={true}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-base font-medium text-blue-800 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-1.5 text-blue-600" />
            Price Analysis
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Deal Assessment Badge */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${dealColor}`}>
              <DealIcon className="h-4 w-4 mr-1.5" />
              <span className="text-sm font-medium">{dealAssessment}</span>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1 flex justify-center items-center">
                <TagIcon className="h-3.5 w-3.5 mr-1" />
                Listed Price
              </div>
              <div className="text-lg font-bold text-gray-900">
                {listedPrice > 0 ? `${listedPrice.toLocaleString()} MAD` : "N/A"}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-xs text-gray-500 mb-1 flex justify-center items-center">
                <ScaleIcon className="h-3.5 w-3.5 mr-1" />
                Market Value
              </div>
              <div className="text-lg font-bold text-gray-900">
                {estimatedPrice.toLocaleString()} MAD
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">Estimation Confidence</span>
              <span className="text-xs font-medium text-gray-700">{estimation.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${confidenceColor} h-2 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${estimation.confidence}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              {estimation.confidence >= 70 ? "High confidence" : 
               estimation.confidence >= 50 ? "Medium confidence" : "Low confidence"}
            </div>
          </div>

          {/* Price Difference */}
          {listedPrice > 0 && (
            <div className={`p-3 rounded-lg ${isGoodDeal ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isGoodDeal ? 'text-green-700' : 'text-red-700'}`}>
                  Price Difference:
                </span>
                <div className="flex items-center">
                  {isGoodDeal ? (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1 text-green-600" />
                  ) : (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-red-600" />
                  )}
                  <span className={`text-sm font-bold ${isGoodDeal ? 'text-green-700' : 'text-red-700'}`}>
                    {Math.abs(difference).toLocaleString()} MAD ({Math.abs(percentDiff)}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Market Analysis */}
          <div className="text-center pt-2">
            <p className={`text-sm ${isGoodDeal ? 'text-green-600' : 'text-red-600'}`}>
              {isGoodDeal 
                ? `This vehicle is priced ${Math.abs(percentDiff)}% below the estimated market value`
                : `This vehicle is priced ${Math.abs(percentDiff)}% above the estimated market value`
              }
            </p>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
          Based on current market data • Updated May 2025
        </div>
      </div>
    </Transition>
  );
}