import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

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
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderEdits, setOrderEdits] = useState(initialOrderState);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/order/state/get`)
      .then((res) => res.json())
      .then((data) => data.success && setStates(data.data))
      .catch((err) => console.error("Failed to fetch states:", err));

    fetch(`${apiUrl}/order/city/get`)
      .then((res) => res.json())
      .then((data) => data.success && setCities(data.data))
      .catch((err) => console.error("Failed to fetch cities:", err));
  }, []);

  // Filter cities based on selected state & search query
  useEffect(() => {
    if (orderEdits.stateId) {
      const filtered = cities
        .filter((c) => c.stateId === parseInt(orderEdits.stateId))
        .filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase())
        );
      setFilteredCities(filtered);
      if (!filtered.some((c) => c.id === orderEdits.cityId)) {
        setOrderEdits((prev) => ({ ...prev, cityId: null }));
      }
    } else {
      setFilteredCities([]);
      setOrderEdits((prev) => ({ ...prev, cityId: null }));
    }
  }, [orderEdits.stateId, query, orderEdits.cityId, cities]);

  // Pass orders to parent
  useEffect(() => {
    setFormData && setFormData(orders);
  }, [orders, setFormData]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderEdits((prev) => ({
      ...prev,
      [name]: name === "cod" ? parseFloat(value) : type === "checkbox" ? checked : value,
    }));
  };

  const handleStateChange = (option) => {
    setOrderEdits((prev) => ({
      ...prev,
      stateId: option ? option.id : null,
      cityId: null,
    }));
    setQuery("");
  };

  const handleCityChange = (cityId) => {
    setOrderEdits((prev) => ({
      ...prev,
      cityId,
    }));
  };

  const handleSaveOrder = () => {
    if (!orderEdits.cusName.trim() || !orderEdits.cusPhone.trim() || !orderEdits.cityId) {
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
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>COD</th>
                <th>Delivery</th>
                <th>Note</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((item, index) => (
                  <tr key={startIndex + index}>
                    <td>{item.cusName}</td>
                    <td>{item.cusPhone}</td>
                    <td>{item.cusAddress}</td>
                    <td>{item.cod}</td>
                    <td>{item.delivery ? "Yes" : "No"}</td>
                    <td>{item.note}</td>
                    <td className="text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleEditOrder(startIndex + index)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDeleteOrder(startIndex + index)} className="text-red-600 hover:text-red-900">Delete</button>
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
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Order Form */}
      <div className="mt-6 p-5 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" name="cusName" placeholder="Customer Name *" value={orderEdits.cusName} onChange={handleFieldChange} className={inputClass} />
          <input type="tel" name="cusPhone" placeholder="Customer Phone *" value={orderEdits.cusPhone} onChange={handleFieldChange} className={inputClass} />

          {/* State Listbox */}
          <div className="relative">
            <Listbox value={states.find((s) => s.id === orderEdits.stateId) || null} onChange={handleStateChange}>
              {({ open }) => (
                <>
                  <Listbox.Button className={`${inputClass} text-left w-full relative flex justify-between items-center pr-3`}>
                    <span>{orderEdits.stateId ? states.find(s => s.id === orderEdits.stateId)?.name : "Select a State *"}</span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 ${open ? "rotate-180" : ""}`} />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white rounded-md shadow-lg">
                    {states.map((state) => (
                      <Listbox.Option key={state.id} value={state} className={({ active }) => `${active ? "bg-blue-600 text-white" : "text-gray-900"} cursor-pointer select-none py-2 pl-3 pr-4`}>
                        {state.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </>
              )}
            </Listbox>
          </div>

          {/* City Listbox */}
          <div className="relative">
            <Listbox value={filteredCities.find((c) => c.id === orderEdits.cityId) || null} onChange={(city) => handleCityChange(city.id)} disabled={!orderEdits.stateId}>
              {({ open }) => (
                <>
                  <Listbox.Button className={`${inputClass} text-left w-full relative flex justify-between items-center pr-3`}>
                    <span>{orderEdits.cityId ? filteredCities.find(c => c.id === orderEdits.cityId)?.name : "Select a City *"}</span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 ${open ? "rotate-180" : ""}`} />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white rounded-md shadow-lg">
                    <div className="p-2 sticky top-0 bg-white z-20">
                      <input type="text" placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} className={`${inputClass} w-full`} />
                    </div>
                    {filteredCities.length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No results found</div>
                    ) : (
                      filteredCities.map((city) => (
                        <Listbox.Option key={city.id} value={city} className={({ active }) => `${active ? "bg-blue-600 text-white" : "text-gray-900"} cursor-pointer select-none py-2 pl-3 pr-4`}>
                          {city.name}
                        </Listbox.Option>
                      ))
                    )}
                  </Listbox.Options>
                </>
              )}
            </Listbox>
          </div>

          <input type="text" name="cusAddress" placeholder="Address" value={orderEdits.cusAddress} onChange={handleFieldChange} className={`${inputClass} col-span-2`} />
          <input type="number" name="cod" placeholder="COD" min="0" value={orderEdits.cod} onChange={handleFieldChange} className={inputClass} />
          <input type="text" name="note" placeholder="Note" value={orderEdits.note} onChange={handleFieldChange} className={inputClass} />

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="delivery" checked={orderEdits.delivery} onChange={handleFieldChange} className="h-5 w-4" />
            <span className="text-sm font-medium text-gray-700">Delivery</span>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <button onClick={handleSaveOrder} className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editingIndex !== null ? "Save Changes" : "+ Add Order"}
          </button>
          {editingIndex !== null && (
            <button onClick={handleCancelEdit} className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
