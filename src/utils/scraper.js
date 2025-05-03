/**
 * Extract car data from avito.ma DOM
 * @returns {Object} - Extracted car data
 */
export function extractCarDataFromDOM() {
  try {
    const getByLabel = (label, container = document) => {
      const labelElement = Array.from(container.querySelectorAll('span.bXFCIH'))
        .find(el => el.textContent.trim() === label);
      
      if (!labelElement) return null;
      
      const valueElement = labelElement.nextElementSibling?.querySelector('span.fjZBup');
      return valueElement?.textContent.trim() || null;
    };

    const featuresContainer = document.querySelector('div.dnArJl');
    const priceElement = document.querySelector('p.jdRkSM');
    const cityElement = document.querySelector('span.iKguVF');
    
    return {
      url: window.location.href,
      year: getByLabel('Année-Modèle', featuresContainer),
      type_boit: getByLabel('Boite de vitesses', featuresContainer),
      type_carburant: getByLabel('Type de carburant', featuresContainer),
      kilometrage: getByLabel('Kilométrage', featuresContainer),
      marke: getByLabel('Marque', featuresContainer),
      model: getByLabel('Modèle', featuresContainer),
      puissance: getByLabel('Puissance fiscale', featuresContainer),
      premiere_main: getByLabel('Première main', featuresContainer),
      Nombre_doors: getByLabel('Nombre de portes', featuresContainer),
      city: cityElement?.textContent.trim() || null,
      price: priceElement?.textContent.trim() || null
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}