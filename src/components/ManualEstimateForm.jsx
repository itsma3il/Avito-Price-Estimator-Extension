import { useState } from 'react';

export default function ManualEstimateForm({ onSubmit, currentUrl }) {
  const [formData, setFormData] = useState({
    year: '',
    type_boit: '',
    type_carburant: '',
    kilometrage: '',
    marke: '',
    model: '',
    puissance: '',
    premiere_main: '',
    Nombre_doors: '5',
    city: '',
    price: '',
    url: currentUrl
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="1990"
            max={new Date().getFullYear()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission *
          </label>
          <select
            name="type_boit"
            value={formData.type_boit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Manuelle">Manual</option>
            <option value="Automatique">Automatic</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type *
          </label>
          <select
            name="type_carburant"
            value={formData.type_carburant}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Diesel">Diesel</option>
            <option value="Essence">Petrol</option>
            <option value="Hybride">Hybrid</option>
            <option value="Electrique">Electric</option>
          </select>
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mileage (km) *
          </label>
          <input
            type="number"
            name="kilometrage"
            value={formData.kilometrage}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <input
            type="text"
            name="marke"
            value={formData.marke}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Power (CV)
          </label>
          <input
            type="number"
            name="puissance"
            value={formData.puissance}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* First Hand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Hand
          </label>
          <select
            name="premiere_main"
            value={formData.premiere_main}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="Oui">Yes</option>
            <option value="Non">No</option>
          </select>
        </div>

        {/* Doors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doors
          </label>
          <select
            name="Nombre_doors"
            value={formData.Nombre_doors}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Current Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Price (MAD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Get Price Estimate
      </button>
    </form>
  );
}