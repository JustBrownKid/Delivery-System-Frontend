import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, XCircleIcon } from "@heroicons/react/20/solid";

// Mock data (could be fetched from an API in a real application)
const mockStates = [
  { id: "S1", name: "California", value: "S1" },
  { id: "S2", name: "New York", value: "S2" },
];

const mockCities = [
  { value: 2, label: "Los Angeles", stateId: "S1" },
  { value: 3, label: "San Francisco", stateId: "S1" },
  { value: 1, label: "New York City", stateId: "S2" },
  { value: 4, label: "Buffalo", stateId: "S2" },
];

const initialOrderState = {
  cusName: "",
  cusPhone: "",
  cusAddress: "",
  cod: 0,
  delivery: true,
  note: "",
  stateId: null,
  cityId: null,
};

const ITEMS_PER_PAGE = 10;

export default function FormUplode({ setFormData }) {
  const [orders, setOrders] = useState([]);
  const [orderEdits, setOrderEdits] = useState(initialOrderState);
  const [filteredCities, setFilteredCities] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Effect to filter cities based on selected state and search query
  useEffect(() => {
    if (orderEdits.stateId) {
      const cities = mockCities.filter((c) => c.stateId === orderEdits.stateId);
      const filtered = query
        ? cities.filter((city) =>
            city.label.toLowerCase().includes(query.toLowerCase())
          )
        : cities;
      setFilteredCities(filtered);
      if (!cities.some((c) => c.value === orderEdits.cityId)) {
        setOrderEdits((prev) => ({ ...prev, cityId: null }));
      }
    } else {
      setFilteredCities([]);
      setOrderEdits((prev) => ({ ...prev, cityId: null }));
    }
  }, [orderEdits.stateId, query, orderEdits.cityId]);

  // Effect to pass order data to the parent component
  useEffect(() => {
    if (setFormData) setFormData(orders);
  }, [orders, setFormData]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderEdits((prev) => ({
      ...prev,
      // Fix: Convert 'cod' value to a number to prevent type errors on the backend
      [name]: name === "cod" ? parseFloat(value) : type === "checkbox" ? checked : value,
    }));
  };

  const handleStateChange = (option) => {
    setOrderEdits((prev) => ({
      ...prev,
      stateId: option ? option.value : null,
      cityId: null, // Reset city when state changes
    }));
    setQuery("");
  };

  const handleCityChange = (cityValue) => {
    setOrderEdits((prev) => ({
      ...prev,
      cityId: cityValue,
    }));
  };

  const handleSaveOrder = () => {
    if (
      !orderEdits.cusName.trim() ||
      !orderEdits.cusPhone.trim() ||
      !orderEdits.cityId
    ) {
      alert("Please fill required fields: Customer Name, Phone, and City.");
      return;
    }

    if (editingIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editingIndex] = orderEdits;
      setOrders(updatedOrders);
      setEditingIndex(null);
    } else {
      setOrders((prev) => [...prev, orderEdits]);
    }
    setOrderEdits(initialOrderState);
  };

  const handleEditOrder = (index) => {
    setEditingIndex(index);
    setOrderEdits(orders[index]);
  };

  const handleDeleteOrder = (index) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = orders.filter((_, i) => i !== index);
      setOrders(updatedOrders);
      if (editingIndex === index) {
        setEditingIndex(null);
        setOrderEdits(initialOrderState);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setOrderEdits(initialOrderState);
  };

  const inputClass =
    "p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full mx-auto p- bg-white rounded-lg mt-6">
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  COD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((item, index) => (
                  <tr key={startIndex + index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.cusName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cusPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cusAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.cod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.delivery ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.note}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditOrder(startIndex + index)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(startIndex + index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Order Form */}
      <div className="mt-6 p-5 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer Name */}
          <input
            type="text"
            name="cusName"
            placeholder="Customer Name *"
            value={orderEdits.cusName}
            onChange={handleFieldChange}
            className={inputClass}
          />

          {/* Customer Phone */}
          <input
            type="tel"
            name="cusPhone"
            placeholder="Customer Phone *"
            value={orderEdits.cusPhone}
            onChange={handleFieldChange}
            className={inputClass}
          />

          {/* State Listbox */}
          <div className="relative">
            <Listbox
              value={
                mockStates.find((s) => s.value === orderEdits.stateId) || null
              }
              onChange={handleStateChange}
            >
              {({ open }) => (
                <>
                  <Listbox.Button className={`${inputClass} text-left w-full relative flex justify-between items-center pr-3`}>
                    <span>
                      {mockStates.find((s) => s.value === orderEdits.stateId)?.name ||
                        "Select a State *"}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {mockStates.map((state) => (
                      <Listbox.Option
                        key={state.id}
                        value={state}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
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
                </>
              )}
            </Listbox>
          </div>

          {/* City Listbox */}
          <div className="relative">
            <Listbox
              value={
                mockCities.find((c) => c.value === orderEdits.cityId) || null
              }
              onChange={(city) => handleCityChange(city.value)}
              disabled={!orderEdits.stateId}
            >
              {({ open }) => (
                <>
                  <Listbox.Button className={`${inputClass} text-left w-full relative flex justify-between items-center pr-3`}>
                    <span>
                      {mockCities.find((c) => c.value === orderEdits.cityId)?.label ||
                        "Select a City *"}
                    </span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-400 transform transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2 sticky top-0 bg-white z-20">
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`${inputClass} w-full`}
                      />
                    </div>
                    {filteredCities.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No results found</div>
                    ) : (
                      filteredCities.map((city) => (
                        <Listbox.Option
                          key={city.value}
                          value={city}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
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
                              {city.label}
                            </span>
                          )}
                        </Listbox.Option>
                      ))
                    )}
                  </Listbox.Options>
                </>
              )}
            </Listbox>
          </div>

          {/* Address */}
          <input
            type="text"
            name="cusAddress"
            placeholder="Address"
            value={orderEdits.cusAddress}
            onChange={handleFieldChange}
            className={`${inputClass} col-span-2`}
          />

          {/* COD */}
          <input
            type="number"
            name="cod"
            placeholder="COD"
            min="0"
            value={orderEdits.cod}
            onChange={handleFieldChange}
            className={inputClass}
          />

          {/* Note */}
          <input
            type="text"
            name="note"
            placeholder="Note"
            value={orderEdits.note}
            onChange={handleFieldChange}
            className={inputClass}
          />

          {/* Delivery checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="delivery"
              checked={orderEdits.delivery}
              onChange={handleFieldChange}
              className="h-5 w-4"
            />
            <span className="text-sm font-medium text-gray-700">Delivery</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleSaveOrder}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingIndex !== null ? "Save Changes" : "+ Add Order"}
          </button>
          {editingIndex !== null && (
            <button
              onClick={handleCancelEdit}
              className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}