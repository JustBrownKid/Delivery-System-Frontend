import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Listbox } from "@headlessui/react";
import ShipperId from "./ShipperId";

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
  const [selectedCity, setSelectedCity] = useState(null);
  const [query, setQuery] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch states and cities from backend
  useEffect(() => {
    fetch("http://localhost:3000/order/state/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStates(data.data);
      })
      .catch((err) => console.error("Failed to fetch states:", err));

    fetch("http://localhost:3000/order/city/get")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCities(data.data);
      })
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  // Filter cities whenever state or search query changes
  useEffect(() => {
    if (selectedState) {
      const filtered = cities
        .filter((c) => c.stateId === selectedState.id)
        .filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );
      setFilteredCities(filtered);
      if (!filtered.some((c) => c.id === selectedCity?.id)) {
        setSelectedCity(null);
        setShipper((prev) => ({ ...prev, cityName: "" }));
      }
    } else {
      setFilteredCities([]);
      setSelectedCity(null);
      setShipper((prev) => ({ ...prev, cityName: "" }));
    }
  }, [selectedState, query, selectedCity, cities]);

  useEffect(() => {
    setShipper((prev) => ({
      ...prev,
      stateName: selectedState?.name || "",
      cityName: "",
    }));
    setSelectedCity(null);
    setQuery("");
  }, [selectedState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipper((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
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

              {/* Phone */}
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
                  onChange={!isDisabled ? setSelectedState : () => { }}
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
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate ${selected ? "font-medium" : "font-normal"
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
                  value={selectedCity}
                  onChange={!isDisabled ? handleCityChange : () => { }}
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
                      <div className="px-4 py-2 text-gray-500">No results found</div>
                    ) : (
                      filteredCities.map((city) => (
                        <Listbox.Option
                          key={city.id}
                          value={city}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-600 text-white" : "text-gray-900"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${selected ? "font-medium" : "font-normal"
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

              {/* Address Field */}
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
