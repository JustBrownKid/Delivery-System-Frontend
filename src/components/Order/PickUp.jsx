import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Listbox } from "@headlessui/react";
import ShipperId from "./ShipperId";

const stateAndCities = {
  CA: ["Los Angeles", "San Francisco", "San Diego"],
  NY: ["New York City", "Buffalo", "Rochester"],
  TX: ["Houston", "Dallas", "Austin"],
  FL: ["Miami", "Orlando", "Tampa"],
};

const states = [
  { id: 1, name: "California", value: "CA" },
  { id: 2, name: "New York", value: "NY" },
  { id: 3, name: "Texas", value: "TX" },
  { id: 4, name: "Florida", value: "FL" },
];

export const PickUp = ({ setPickUpData, setPickUp }) => {
  const [shipper, setShipper] = useState({ stateName: "", cityName: "" });
  const [shipperSelected, setShipperSelected] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [selectedState, setSelectedState] = useState(states[0]);
  const [selectedCity, setSelectedCity] = useState("");
  const [query, setQuery] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const filteredCities =
    query === ""
      ? stateAndCities[selectedState.value] || []
      : (stateAndCities[selectedState.value] || []).filter((city) =>
          city.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    setShipper((prev) => ({
      ...prev,
      stateName: selectedState.value,
      cityName: "",
    }));
    setSelectedCity("");
    setQuery("");
  }, [selectedState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipper((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    setShipper((prev) => ({ ...prev, cityName }));
  };

  const handleCreateOrder = () => {
    const PickUpData = {
      shipperId: shipper.id,
      pickupDate,
      name: shipper.name,
      phone: shipper.phone,
      cityName: shipper.cityName,
      address: shipper.address,
      stateName: shipper.stateName,
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

      <div className="px-5 bg-white rounded-lg shadow-lg space-y-6">
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

        {shipperSelected && pickupDate && (
          <div className="space-y-4 p-5">
            <div className="bg-gray-200 p-3 rounded-md text-gray-900 font-medium">
              Pickup Date: {pickupDate.format("MMMM D, YYYY")}
            </div>

            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Shipper Name"
                disabled={isDisabled}
                value={shipper.name || ""}
                onChange={handleInputChange}
                className={inputClass}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                disabled={isDisabled}
                value={shipper.phone || ""}
                onChange={handleInputChange}
                className={inputClass}
              />

              <Listbox
                value={selectedState}
                onChange={!isDisabled ? setSelectedState : () => {}}
              >
                <Listbox.Button
                  disabled={isDisabled}
                  className={`${inputClass} text-left`}
                >
                  {selectedState ? selectedState.name : "Select a State"}
                </Listbox.Button>
                <Listbox.Options>
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

              <Listbox
                value={selectedCity}
                onChange={!isDisabled ? handleCityChange : () => {}}
              >
                <Listbox.Button
                  disabled={isDisabled}
                  className={`${inputClass} text-left`}
                >
                  {selectedCity || "Select a City"}
                </Listbox.Button>
                <Listbox.Options className="max-h-60 overflow-auto bg-white py-1 shadow-lg">
                  <div className="p-2">
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
                    <div className="px-4 py-2 text-gray-500">No results found</div>
                  ) : (
                    filteredCities.map((city, index) => (
                      <Listbox.Option
                        key={index}
                        value={city}
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
                            {city}
                          </span>
                        )}
                      </Listbox.Option>
                    ))
                  )}
                </Listbox.Options>
              </Listbox>

              <input
                type="text"
                name="address"
                placeholder="Address"
                disabled={isDisabled}
                value={shipper.address || ""}
                onChange={handleInputChange}
                className={`${inputClass} col-span-1 md:col-span-2`}
              />

              <button
                onClick={handleCreateOrder}
                disabled={isDisabled}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickUp;
