import { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import carBrands from '../data/carBrands.json';

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
    url: currentUrl,
  });

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');

  // Transform JSON brands into Combobox-compatible format
  const brands = Object.keys(carBrands).map((brand, index) => ({
    id: index + 1,
    name: brand,
  }));

  // Filter brands based on query
  const filteredBrands =
    brandQuery === ''
      ? brands
      : brands.filter((brand) =>
          brand.name.toLowerCase().includes(brandQuery.toLowerCase())
        );

  // Filter models based on selected brand and query
  const filteredModels =
    selectedBrand && carBrands[selectedBrand.name]
      ? modelQuery === ''
        ? carBrands[selectedBrand.name]
        : carBrands[selectedBrand.name].filter((model) =>
            model.toLowerCase().includes(modelQuery.toLowerCase())
          )
      : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      marke: selectedBrand?.name || brandQuery,
      model: selectedModel || modelQuery,
    });
  };

  useEffect(() => {
    // Update formData when brand or model changes
    setFormData((prev) => ({
      ...prev,
      marke: selectedBrand?.name || brandQuery,
      model: selectedModel || modelQuery,
    }));
  }, [selectedBrand, selectedModel, brandQuery, modelQuery]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Year *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="1990"
            max={new Date().getFullYear()}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Transmission *
          </label>
          <select
            name="type_boit"
            value={formData.type_boit}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
            required
          >
            <option value="">Select</option>
            <option value="Manuelle">Manual</option>
            <option value="Automatique">Automatic</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fuel Type *
          </label>
          <select
            name="type_carburant"
            value={formData.type_carburant}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Mileage (km) *
          </label>
          <input
            type="number"
            name="kilometrage"
            value={formData.kilometrage}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Brand *
          </label>
          <Combobox
            value={selectedBrand}
            onChange={(brand) => {
              setSelectedBrand(brand);
              setSelectedModel(null); // Reset model when brand changes
              setModelQuery('');
            }}
            nullable
          >
            <div className="relative">
              <Combobox.Input
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                onChange={(e) => setBrandQuery(e.target.value)}
                displayValue={(brand) => brand?.name || brandQuery}
                placeholder="Select or type brand"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm z-10">
                {filteredBrands.length === 0 && brandQuery !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Type your custom brand
                  </div>
                ) : (
                  filteredBrands.map((brand) => (
                    <Combobox.Option
                      key={brand.id}
                      value={brand}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {brand.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-blue-600' : 'text-blue-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Model *
          </label>
          <Combobox
            value={selectedModel}
            onChange={setSelectedModel}
            disabled={!selectedBrand && !brandQuery}
            nullable
          >
            <div className="relative">
              <Combobox.Input
                className={`w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm ${
                  !selectedBrand && !brandQuery ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onChange={(e) => setModelQuery(e.target.value)}
                displayValue={(model) => model || modelQuery}
                placeholder={
                  selectedBrand || brandQuery
                    ? 'Select or type model'
                    : 'Select brand first'
                }
              />
              <Combobox.Button
                className={`absolute inset-y-0 right-0 flex items-center pr-2 ${
                  !selectedBrand && !brandQuery ? 'opacity-50' : ''
                }`}
              >
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              {(selectedBrand || brandQuery) && (
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm z-10">
                  {filteredModels.length === 0 && modelQuery !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Type your custom model
                    </div>
                  ) : (
                    filteredModels.map((model) => (
                      <Combobox.Option
                        key={model}
                        value={model}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {model}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-blue-600' : 'text-blue-600'
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
        </div>

        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Power (CV)
          </label>
          <input
            type="number"
            name="puissance"
            value={formData.puissance}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>

        {/* First Hand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Hand
          </label>
          <select
            name="premiere_main"
            value={formData.premiere_main}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
          >
            <option value="">Select</option>
            <option value="Oui">Yes</option>
            <option value="Non">No</option>
          </select>
        </div>

        {/* Doors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Doors
          </label>
          <select
            name="Nombre_doors"
            value={formData.Nombre_doors}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm appearance-none"
          >
            <option value="3">3</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>

        {/* Current Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Price (MAD)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        Get Price Estimate
      </button>
    </form>
  );
}