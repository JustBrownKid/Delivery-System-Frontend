import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Listbox } from "@headlessui/react";
import ShipperId from "./ShipperId";

const stateAndCities = {
  CA: [
    { id: 1, name: "Los Angeles" },
    { id: 2, name: "San Francisco" },
    { id: 3, name: "San Diego" },
  ],
  NY: [
    { id: 4, name: "New York City" },
    { id: 5, name: "Buffalo" },
    { id: 6, name: "Rochester" },
  ],
  TX: [
    { id: 7, name: "Houston" },
    { id: 8, name: "Dallas" },
    { id: 9, name: "Austin" },
  ],
  FL: [
    { id: 10, name: "Miami" },
    { id: 11, name: "Orlando" },
    { id: 12, name: "Tampa" },
  ],
};

const states = [
  { id: 1, name: "California", value: "CA" },
  { id: 2, name: "New York", value: "NY" },
  { id: 3, name: "Texas", value: "TX" },
  { id: 4, name: "Florida", value: "FL" },
];

export const PickUp = ({ setPickUpData, setPickUp }) => {
  const [shipper, setShipper] = useState({
    stateName: "",
    cityName: "",
    name: "",
    phone: "",
    address: "",
  });
  const [shipperSelected, setShipperSelected] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null); // Now stores the entire city object
  const [query, setQuery] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const filteredCities =
    query === ""
      ? stateAndCities[selectedState?.value] || []
      : (stateAndCities[selectedState?.value] || []).filter((city) =>
          city.name.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    setShipper((prev) => ({
      ...prev,
      stateName: selectedState?.value || "",
      cityName: "",
    }));
    setSelectedCity(null); // Reset city to null
    setQuery("");
  }, [selectedState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipper((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (city) => {
    // Store the entire city object
    setSelectedCity(city);
    // Update the shipper state with the city name
    setShipper((prev) => ({ ...prev, cityName: city.name }));
  };

  const handleCreateOrder = () => {
    const PickUpData = {
      shipperId: shipper.id,
      pickupDate,
      pickUpName: shipper.name,
      pickUpPhone: shipper.phone,
      pickUpCityId: selectedCity?.id,
      pickUpAddress: shipper.address,
    };
    setPickUpData(PickUpData);
    setIsDisabled(true);
    setPickUp(true);
  };

  const inputClass =
    "p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="font-sans p-6 w-full mx-auto">
      <ShipperId setShipper={setShipper} setSelect={setShipperSelected} />

      <div className="px-5 rounded-lg space-y-6">
        {/* Date Picker Section */}
        {shipperSelected && !pickupDate && (
          <div className="w-fit p-2 rounded-md">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Select Pickup Date"
                  minDate={dayjs().add(1, "day")}
                  onChange={setPickupDate}
                  value={pickupDate}
                  disabled={isDisabled}
                  className="w-full"
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        )}

        {/* Form Fields Section */}
        {shipperSelected && pickupDate && (
          <div className="space-y-4 p-5">
            <div className="bg-gray-200 p-3 rounded-md text-gray-900 font-medium">
              Pickup Date: {pickupDate.format("MMMM D, YYYY")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Shipper Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shipper Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Shipper Name"
                  disabled={isDisabled}
                  value={shipper.name || ""}
                  onChange={handleInputChange}
                  className={`${inputClass} w-full mt-1`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  disabled={isDisabled}
                  value={shipper.phone || ""}
                  onChange={handleInputChange}
                  className={`${inputClass} w-full mt-1`}
                />
              </div>

              {/* State Listbox */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  State *
                </label>
                <Listbox
                  value={selectedState}
                  onChange={!isDisabled ? setSelectedState : () => {}}
                >
                  <Listbox.Button
                    disabled={isDisabled}
                    className={`${inputClass} text-left w-full mt-1`}
                  >
                    {selectedState ? selectedState.name : "Select a State"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {states.map((state) => (
                      <Listbox.Option
                        key={state.id}
                        value={state}
                        disabled={isDisabled}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {state.name}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>

              {/* City Listbox */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <Listbox
                  value={selectedCity} // The value is now the city object
                  onChange={!isDisabled ? handleCityChange : () => {}}
                >
                  <Listbox.Button
                    disabled={isDisabled || !selectedState}
                    className={`${inputClass} text-left w-full mt-1`}
                  >
                    {selectedCity ? selectedCity.name : "Select a City"}
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="sticky top-0 bg-white p-2 z-20">
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={query}
                        disabled={isDisabled}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`${inputClass} w-full`}
                      />
                    </div>
                    {filteredCities.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">
                        No results found
                      </div>
                    ) : (
                      filteredCities.map((city) => (
                        <Listbox.Option
                          key={city.id}
                          value={city}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {city.name}
                            </span>
                          )}
                        </Listbox.Option>
                      ))
                    )}
                  </Listbox.Options>
                </Listbox>
              </div>

              {/* Address Field (spans 3 columns) */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  disabled={isDisabled}
                  value={shipper.address || ""}
                  onChange={handleInputChange}
                  className={`${inputClass} w-full mt-1`}
                />
              </div>

              {/* Create Order Button */}
              <div className="flex items-end">
                <button
                  onClick={handleCreateOrder}
                  disabled={isDisabled}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickUp;