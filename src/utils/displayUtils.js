/**
 * Create estimation display element
 * @param {Object} estimation - Estimation result
 * @returns {HTMLElement} - Display element
 */
export function createEstimationDisplay(estimation) {
    const container = document.createElement('div');
    container.id = 'car-estimator-display';
    container.className = 'estimator-display';
    
    if (estimation.error) {
      container.innerHTML = `
        <div class="estimator-error">
          <svg class="estimator-error-icon" viewBox="0 0 20 20">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
          </svg>
          <span>${estimation.error}</span>
        </div>
      `;
      return container;
    }
  
    const listedPrice = parseInt(estimation.listedPrice) || 0;
    const estimatedPrice = parseInt(estimation.estimatedPrice) || 0;
    const difference = listedPrice - estimatedPrice;
    const percentDiff = Math.round((difference / estimatedPrice) * 100);
    
    const isGoodDeal = difference <= 0;
    const differenceText = isGoodDeal ? 'Good deal' : 'Overpriced';
    const differenceClass = isGoodDeal ? 'estimator-good-deal' : 'estimator-overpriced';
  
    container.innerHTML = `
      <div class="estimator-header">
        <h3>Market Price Estimate</h3>
        <span class="estimator-confidence">${estimation.confidence}% confidence</span>
      </div>
      
      <div class="estimator-price-row">
        <span>Estimated Value:</span>
        <strong>${formatPrice(estimatedPrice)} MAD</strong>
      </div>
      
      ${listedPrice > 0 ? `
        <div class="estimator-price-row">
          <span>Listed Price:</span>
          <strong>${formatPrice(listedPrice)} MAD</strong>
        </div>
        
        <div class="estimator-difference ${differenceClass}">
          <span>${differenceText}:</span>
          <strong>${formatPrice(Math.abs(difference))} MAD (${Math.abs(percentDiff)}%)</strong>
        </div>
      ` : ''}
      
      <div class="estimator-footer">
        <small>Powered by Car Price Estimator</small>
      </div>
    `;
    
    return container;
  }
  
  function formatPrice(price) {
    return new Intl.NumberFormat('fr-MA').format(price);
  }