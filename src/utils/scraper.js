/**
 * Extract car data from avito.ma DOM
 * @returns {Object} - Extracted car data
 */
export function extractCarDataFromDOM() {
  try {
    const featuresContainer = document.querySelector('div.sc-19cngu6-0.dnArJl');
    const priceElement = document.querySelector('p.sc-1x0vz2r-0.gwVXBO');
    const cityElement = document.querySelector('a.sc-1cf7u6r-0.gRyZxr.sc-16q833i-2.cBCSGa');
    
    // Extracting car features from the container
    const features = [...featuresContainer.querySelectorAll('.sc-19cngu6-1.doRGIC')].map(feature => {
      const value = feature.querySelector('span.sc-1x0vz2r-0.fjZBup')?.textContent.trim();
      const label = feature.querySelector('span.sc-1x0vz2r-0.bXFCIH')?.textContent.trim();
      return { label, value };
    });
    // Create a mapping of features
    const carData = features.reduce((data, feature) => {
      switch (feature.label) {
        case 'Année-Modèle':
          data.year = feature.value;
          break;
        case 'Boite de vitesses':
          data.type_boit = feature.value;
          break;
        case 'Type de carburant':
          data.type_carburant = feature.value;
          break;
        case 'Kilométrage':
          data.kilometrage = feature.value;
          break;
        case 'Marque':
          data.marke = feature.value;
          break;
        case 'Modèle':
          data.model = feature.value;
          break;
        case 'Nombre de portes':
          data.Nombre_doors = feature.value;
          break;
        case 'Première main':
          data.premiere_main = feature.value;
          break;
        case 'Puissance fiscale':
          data.puissance = feature.value;
          break;
        case 'Origine':
          data.origin = feature.value;
          break;
        case 'État':
          data.etat = feature.value;
          break;
        default:
          break;
      }
      
      return data;
    }, {});
    return {
      url: window.location.href,
      ...carData,
      city: cityElement?.textContent.trim() || null,
      price: priceElement?.textContent.trim() || null,
    };

  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}
