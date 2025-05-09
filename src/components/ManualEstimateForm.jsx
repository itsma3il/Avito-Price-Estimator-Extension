import { useState, useEffect } from 'react';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  CheckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  MapPinIcon,
  TruckIcon,
  WrenchIcon,
  KeyIcon,
  DocumentCheckIcon,
  XMarkIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import carBrands from '../data/carBrands.json';

// Moved outside: Input field with icon
const InputWithIcon = ({ icon: Icon, label, name, type, value, onChange, placeholder, min, max, required, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3.5 py-2.5 rounded-lg border ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'} shadow-sm transition-all duration-200 text-sm`}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// Moved outside: Select field with icon
const SelectWithIcon = ({ icon: Icon, label, name, value, onChange, options, required, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-2.5 bg-white rounded-lg border ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'} shadow-sm transition-all duration-200 text-sm appearance-none`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-8"> {/* Adjusted pr-8 for XMarkIcon if select has its own arrow */}
          <XMarkIcon className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

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
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const brands = Object.keys(carBrands).map((brand, index) => ({
    id: index + 1,
    name: brand,
  }));

  const filteredBrands =
    brandQuery === ''
      ? brands
      : brands.filter((brand) =>
          brand.name.toLowerCase().includes(brandQuery.toLowerCase())
        );

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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.year) {
        newErrors.year = "Year is required";
        isValid = false;
      } else if (formData.year < 1990 || formData.year > new Date().getFullYear()) {
        newErrors.year = `Year must be between 1990 and ${new Date().getFullYear()}`;
        isValid = false;
      }

      if (!formData.kilometrage) {
        newErrors.kilometrage = "Mileage is required";
        isValid = false;
      } else if (isNaN(formData.kilometrage) || Number(formData.kilometrage) < 0) {
        newErrors.kilometrage = "Mileage must be a positive number"; // Added validation for positive number
        isValid = false;
      }


      if (!formData.type_boit) {
        newErrors.type_boit = "Transmission is required";
        isValid = false;
      }

      if (!formData.type_carburant) {
        newErrors.type_carburant = "Fuel type is required";
        isValid = false;
      }
      
    }

    if (currentStep === 2) {
      if (!selectedBrand && !brandQuery) {
        newErrors.marke = "Brand is required";
        isValid = false;
      }

      if (!selectedModel && !modelQuery) {
        newErrors.model = "Model is required";
        isValid = false;
      }
    }
    // Add validation for step 3 if needed, for example, for price
    if (currentStep === 3) {
      if (!formData.puissance) {
        newErrors.puissance = "Power CV  is required";
        isValid = false;
      }
        // Example: if price was a required field in step 3
        // if (!formData.price) {
        //     newErrors.price = "Price is required";
        //     isValid = false;
        // }
    }


    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the current step before final submission, especially if it's the last step
    if (!validateStep(step)) { // Or you might want to validate all steps: !validateStep(1) || !validateStep(2) || !validateStep(3)
      return;
    }

    onSubmit({
      ...formData,
      marke: selectedBrand?.name || brandQuery,
      model: selectedModel || modelQuery,
    });
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      marke: selectedBrand?.name || brandQuery,
      model: selectedModel || modelQuery,
    }));
  }, [selectedBrand, selectedModel, brandQuery, modelQuery]);


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="w-1/3 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <div className="text-xs mt-1 font-medium text-gray-500">Basic Info</div>
          </div>
          <div className="w-1/3 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <div className="text-xs mt-1 font-medium text-gray-500">Car Details</div>
          </div>
          <div className="w-1/3 text-center">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <div className="text-xs mt-1 font-medium text-gray-500">Additional</div>
          </div>
        </div>
        <div className="mt-2 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="h-0.5 w-full bg-gray-200"></div>
          </div>
          <div
            className="relative h-0.5 bg-blue-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }} // Assuming 3 steps total, so 2 segments for progress
          ></div>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Basic Vehicle Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={CalendarIcon}
              label="Manufacturing Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="e.g. 2015"
              min="1990"
              max={new Date().getFullYear()}
              required
              error={errors.year}
            />

            <InputWithIcon
              icon={TruckIcon}
              label="Mileage"
              name="kilometrage"
              type="number"
              value={formData.kilometrage}
              onChange={handleInputChange}
              placeholder="e.g. 80000"
              min="0"
              required
              error={errors.kilometrage}
            />

            <SelectWithIcon
              icon={ArrowsUpDownIcon}
              label="Transmission"
              name="type_boit"
              value={formData.type_boit}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select transmission type" },
                { value: "Manuelle", label: "Manual" },
                { value: "Automatique", label: "Automatic" }
              ]}
              required
              error={errors.type_boit}
            />

            <SelectWithIcon
              icon={WrenchIcon}
              label="Fuel Type"
              name="type_carburant"
              value={formData.type_carburant}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select fuel type" },
                { value: "Diesel", label: "Diesel" },
                { value: "Essence", label: "Petrol" },
                { value: "Hybride", label: "Hybrid" },
                { value: "Electrique", label: "Electric" }
              ]}
              required
              error={errors.type_carburant}
            />
          </div>
          
          <div className="pt-4">
            <button
              type="button"
              onClick={nextStep}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Continue to Car Details
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Car Make and Model */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Car Make and Model</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <div className={`${errors.marke ? 'ring-1 ring-red-500 rounded-lg' : ''}`}>
                <Combobox
                  value={selectedBrand}
                  onChange={(brand) => {
                    setSelectedBrand(brand);
                    setSelectedModel(null); 
                    setModelQuery('');
                    if (errors.marke) setErrors(prev => ({ ...prev, marke: null }));
                  }}
                  nullable
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <SparklesIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Combobox.Input
                      className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors.marke ? 'border-red-300' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm`}
                      onChange={(e) => setBrandQuery(e.target.value)}
                      displayValue={(brand) => brand?.name || brandQuery}
                      placeholder="Select or type brand"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                        {filteredBrands.length === 0 && brandQuery !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            No brand found. Type to add custom brand. {/* Adjusted message */}
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
                    </Transition>
                  </div>
                </Combobox>
              </div>
              {errors.marke && <p className="mt-1 text-xs text-red-600">{errors.marke}</p>}
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Model <span className="text-red-500">*</span>
              </label>
              <div className={`${errors.model ? 'ring-1 ring-red-500 rounded-lg' : ''}`}>
                <Combobox
                  value={selectedModel}
                  onChange={(model) => {
                    setSelectedModel(model);
                    if (errors.model) setErrors(prev => ({ ...prev, model: null }));
                  }}
                  disabled={!selectedBrand && !brandQuery}
                  nullable
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DocumentCheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <Combobox.Input
                      className={`w-full pl-10 pr-10 py-2.5 bg-white border ${errors.model ? 'border-red-300' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm ${
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
                      className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                        !selectedBrand && !brandQuery ? 'opacity-50' : ''
                      }`}
                      disabled={!selectedBrand && !brandQuery} // Also disable button if input is disabled
                    >
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    
                    {(selectedBrand || brandQuery) && (
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                          {filteredModels.length === 0 && modelQuery !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              No model found. Type to add custom model. {/* Adjusted message */}
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
                      </Transition>
                    )}
                  </div>
                </Combobox>
              </div>
              {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model}</p>}
            </div>
          </div>
          
          <div className="pt-4 flex space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-1/2 flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="w-1/2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Additional Information */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              icon={CurrencyDollarIcon}
              label="Power (CV)"
              name="puissance"
              type="number"
              value={formData.puissance}
              onChange={handleInputChange}
              placeholder="e.g. 110"
              min="0"
              required
              error={errors.puissance}
            />

            <SelectWithIcon
              icon={KeyIcon}
              label="First Hand"
              name="premiere_main"
              value={formData.premiere_main}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select option" },
                { value: "Oui", label: "Yes" },
                { value: "Non", label: "No" }
              ]}
              // Add error={errors.premiere_main} if you add validation for it
            />

            <SelectWithIcon
              icon={TruckIcon}
              label="Doors"
              name="Nombre_doors"
              value={formData.Nombre_doors}
              onChange={handleInputChange}
              options={[
                { value: "3", label: "3 Doors" },
                { value: "5", label: "5 Doors" }
              ]}
              // Add error={errors.Nombre_doors} if you add validation for it
            />

            <InputWithIcon
              icon={MapPinIcon}
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Casablanca"
              // Add error={errors.city} if you add validation for it
            />
             {/* Optional: Price field if it's part of the estimate form */}
            {/*
            <InputWithIcon
              icon={CurrencyDollarIcon}
              label="Price (Optional)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g. 150000"
              min="0"
              error={errors.price}
            />
            */}
          </div>
          
          <div className="pt-4 flex space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-1/2 flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Get Price Estimate
            </button>
          </div>
        </div>
      )}
    </form>
  );
}