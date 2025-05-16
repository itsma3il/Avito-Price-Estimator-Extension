# Car Price Estimator Pro

Car Price Estimator Pro is a browser extension designed to provide accurate market price estimates for cars listed on [avito.ma](https://www.avito.ma). This tool allows users to either manually input car details or automatically extract data from car listings to determine an estimated market value. It is built with React, TailwindCSS, and Vite, and leverages Chrome's extension APIs for seamless integration with the browser.

---
## Related Repositories

- **Machine Learning Model**:  
   [Predict_Price_Car](https://github.com/eddaoudi-mohamed/Predict_Price_Car) – Contains the core machine learning model used for car price estimation.

- **Backend API**:  
   Repository coming soon.
---

## Key Features

- **Manual Price Estimation**: Users can manually input car details such as manufacturing year, mileage, fuel type, and other specifications to calculate an estimated price.
- **Automated Data Extraction**: Automatically extracts car details from avito.ma listings to generate a market price estimate.
- **Confidence Score**: Displays a confidence percentage to indicate the reliability of the estimation.
- **Deal Assessment**: Identifies whether the listed price is a good deal or overpriced based on market trends.
- **Intuitive User Interface**: Designed for simplicity and ease of use, with a clean and responsive design.
- **Standalone Mode**: Includes a standalone page for manual estimations without relying on avito.ma listings.

---

## Installation Guide

### For Google Chrome

1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `dist` folder from the project directory.

---

## How to Use

1. **Visit a Car Listing**: Navigate to a car listing on [avito.ma](https://www.avito.ma).
2. **Open the Extension**: Click the extension icon in the browser toolbar.
3. **Choose an Option**:
   - **Manual Estimate**: Enter car details manually to get a price estimation.
   - **Website Estimate**: Automatically extract details from the current listing and generate an estimate.
4. **Review Results**: View the estimated market price, confidence score, and deal analysis.

---

## Development Setup

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn** package manager
- **Google Chrome** (for testing the extension)

### Steps to Set Up

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/car-price-estimator.git
   cd car-price-estimator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Load the extension in Chrome:
 - Navigate to `chrome://extensions/`.
 - Enable __Developer mode__.
 - Click __Load unpacked__ and select the `dist` folder.
 
---

### Technologies Used
 - __React__: For building the user interface.
 - __TailwindCSS__: For styling the application.
 - __Vite__: For fast development and build processes.
 - __Chrome__ Extension APIs: For browser integration.
 - __JavaScript__: For scripting and logic.
 - __Headless__ UI: For accessible and customizable UI components.

---

### API Integration

The project integrates with a backend API to estimate car prices. The API expects normalized car data and returns an estimation result. The API details are configured in the `src/services/apiService.js` file.

Example API Request
   ```bash
   {
   "year": 2015,
   "type_boit": "manual",
   "type_carburant": "diesel",
   "kilometrage": 80000,
   "marke": "Toyota",
   "model": "Corolla",
   "puissance": 110,
   "premiere_main": 1,
   "Nombre_doors": 5,
   "city": "Casablanca",
   "price": 150000,
   "url": "https://www.avito.ma/..."
   }
   ```

--- 

### Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
   ```bash
   git clone https://github.com/itsma3il/Avito-Price-Estimator-Extension
   ```
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

### License

This project is licensed under the MIT License.

--- 

### Contact

For questions or support, please contact [mousdik.ismail@gmail.com].