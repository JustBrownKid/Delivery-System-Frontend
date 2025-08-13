import React, { useState, useEffect } from "react";
import Select from "react-select";

const mockStates = [
  { value: "S1", label: "California" },
  { value: "S2", label: "New York" },
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

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (orderEdits.stateId) {
      const cities = mockCities.filter((c) => c.stateId === orderEdits.stateId);
      setFilteredCities(cities);
      if (!cities.some((c) => c.value === orderEdits.cityId)) {
        setOrderEdits((prev) => ({ ...prev, cityId: null }));
      }
    } else {
      setFilteredCities([]);
      setOrderEdits((prev) => ({ ...prev, cityId: null }));
    }
  }, [orderEdits.stateId]);

  useEffect(() => {
    if (setFormData) {
      setFormData(orders);
    }
  }, [orders, setFormData]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderEdits((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStateChange = (option) => {
    setOrderEdits((prev) => ({
      ...prev,
      stateId: option ? option.value : null,
      cityId: null,
    }));
  };

  const handleCityChange = (option) => {
    setOrderEdits((prev) => ({
      ...prev,
      cityId: option ? option.value : null,
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
    const orderToEdit = orders[index];
    setOrderEdits(orderToEdit);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setOrderEdits(initialOrderState);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow mt-6">
      {/* Orders Table (moved to top) */}
      <table className="w-full border-collapse border border-gray-300 text-sm mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Address</th>
            <th className="border border-gray-300 p-2">COD</th>
            <th className="border border-gray-300 p-2">City</th>
            <th className="border border-gray-300 p-2">Delivery</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-6 text-gray-500">
                No orders yet.
              </td>
            </tr>
          ) : (
            paginatedOrders.map((o, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{o.cusName}</td>
                <td className="border border-gray-300 p-2">{o.cusPhone}</td>
                <td className="border border-gray-300 p-2">{o.cusAddress}</td>
                <td className="border border-gray-300 p-2">{o.cod}</td>
                
                <td className="border border-gray-300 p-2">
                  {mockCities.find((c) => c.value === o.cityId)?.label || "-"}
                </td>
                <td className="border border-gray-300 p-2 text-center">{o.delivery ? "Yes" : "No"}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleEditOrder(startIndex + i)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className="mb-6 border p-4 rounded bg-green-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
            <input
              name="cusName"
              value={orderEdits.cusName}
              onChange={handleFieldChange}
              placeholder="Customer Name *"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Customer Phone *</label>
            <input
              name="cusPhone"
              value={orderEdits.cusPhone}
              onChange={handleFieldChange}
              placeholder="Customer Phone *"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              name="cusAddress"
              value={orderEdits.cusAddress}
              onChange={handleFieldChange}
              placeholder="Address"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">COD</label>
            <input
              name="cod"
              type="number"
              min={0}
              value={orderEdits.cod}
              onChange={handleFieldChange}
              placeholder="COD"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <Select
              options={mockStates}
              value={mockStates.find((opt) => opt.value === orderEdits.stateId) || null}
              onChange={handleStateChange}
              placeholder="Select State *"
              className="mt-1 block w-full"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <Select
              options={filteredCities}
              value={filteredCities.find((opt) => opt.value === orderEdits.cityId) || null}
              onChange={handleCityChange}
              placeholder="Select City *"
              isDisabled={!orderEdits.stateId}
              className="mt-1 block w-full"
            />
          </div>
          <div className="col-span-1 flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="delivery"
                checked={orderEdits.delivery}
                onChange={handleFieldChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Delivery</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              name="note"
              value={orderEdits.note}
              onChange={handleFieldChange}
              placeholder="Note"
              rows="1"
              className="mt-1 block w-full border p-2 rounded"
            />
          </div>
        </div>
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