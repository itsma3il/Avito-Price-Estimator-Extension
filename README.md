# Car Price Estimator Pro

Car Price Estimator Pro is a browser extension designed to deliver precise market price estimates for cars listed on [avito.ma](https://www.avito.ma). This tool enables users to either manually input car details or automatically extract data from car listings on the website to determine an estimated market value.

## Key Features

- **Manual Price Estimation**: Enter car details such as manufacturing year, mileage, fuel type, and other specifications to calculate an estimated price.
- **Automated Data Extraction**: Seamlessly extract car details from avito.ma listings to generate a market price estimate.
- **Confidence Score**: Displays a confidence percentage to indicate the reliability of the estimation.
- **Deal Assessment**: Identifies whether the listed price is a good deal or overpriced based on market trends.
- **Intuitive User Interface**: Designed for simplicity and ease of use.

## Installation Guide

### For Google Chrome
1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `dist` folder from the project directory.

## How to Use

1. Visit a car listing on [avito.ma](https://www.avito.ma).
2. Click the extension icon in the browser toolbar.
3. Choose one of the following options:
   - **Manual Estimate**: Enter the car details manually.
   - **Website Estimate**: Automatically extract details from the current listing.
4. Review the estimated market price, confidence score, and deal analysis.

## Development Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager

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

## Contribution

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the [MIT License](LICENSE).
