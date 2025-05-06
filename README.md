# Car Price Estimator Pro

Car Price Estimator Pro is a browser extension designed to provide accurate market price estimates for cars listed on [avito.ma](https://www.avito.ma). This tool allows users to manually input car details or extract data directly from car listings on the website to get an estimated market value.

## Features

- **Manual Estimation**: Input car details such as year, mileage, fuel type, and more to get an estimated price.
- **Website Integration**: Automatically extract car details from avito.ma listings and estimate the market price.
- **Confidence Score**: Provides a confidence percentage for the estimation.
- **Good Deal Indicator**: Highlights whether the listed price is a good deal or overpriced compared to the market value.
- **User-Friendly Interface**: Simple and intuitive design for easy use.

## Installation

### Chrome
1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `dist` folder from the project directory.


## Usage

1. Navigate to a car listing on [avito.ma](https://www.avito.ma).
2. Click the extension icon in the browser toolbar.
3. Choose between:
   - **Manual Estimate**: Fill in the car details manually.
   - **Website Estimate**: Automatically extract details from the current listing.
4. View the estimated market price, confidence score, and deal analysis.

## Development

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/car-price-estimator.git
   cd car-price-estimator