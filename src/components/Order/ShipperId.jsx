import React, { useState } from 'react';

const ShipperId = ({ setShipper, setSelect }) => {
  const [shipperInfo, setShipperInfo] = useState(null);
  const [shipperId, setShipperId] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipperSelected, setShipperSelected] = useState(false);
  const [error, setError] = useState(null);

  const ShipperIdGet = async () => {
    if (!shipperId) {
      setError("Please enter a Shipper ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setShipperInfo(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/shipper/${shipperId}`);

      if (!response.ok) {
        throw new Error(`Shipper with ID ${shipperId} not found.`);
      }

      const result = await response.json();
      if (result && result.success && result.data) {
        setShipperInfo(result.data);
      } else {
        setShipper(null);
        setSelect(false);
        setShipperSelected(false);
        throw new Error(result.message || "Failed to fetch shipper data.");
      }
    } catch (err) {
      setError(err.message);
      setShipperInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const selectShipper = () => {
    setShipper(shipperInfo);
    setSelect(true);
    setShipperSelected(true);
  };

  return (
    <div className="w-full p-4  rounded-lg mb-4 space-y-4 mt-1">
      {!shipperSelected && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={shipperId}
            onChange={(e) => setShipperId(e.target.value)}
            placeholder="Enter Shipper ID"
          />
          <button
            onClick={ShipperIdGet}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Find Shipper"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error}</p>
        </div>
      )}

      {shipperInfo && (
        <div className="bg-gray-300 flex justify-between px-2 py-2 rounded-md">
          <div className="mt-2 flex text-sm text-gray-700 space-y-1 font-medium">
            <span className="text-gray-800 font-medium text-lg mx-4">{shipperInfo.name}</span>
            <span className="text-gray-800 font-medium text-lg mx-4">{shipperInfo.phone}</span>
            <span className="text-gray-800 font-medium text-lg mx-4">{shipperInfo.cityName}</span>
            <span className="text-gray-800 font-medium text-lg mx-4">{shipperInfo.stateName}</span>
          </div>
          <button
            onClick={selectShipper}
            disabled={shipperSelected}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Shipper
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipperId;
