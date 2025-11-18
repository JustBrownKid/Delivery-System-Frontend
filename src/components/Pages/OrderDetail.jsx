import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderDetailPage = () => {
  const [shipperId, setShipperId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
  if (!shipperId && !name && !phone && !trackingId && !startDate && !endDate) {
    setError("Please enter at least one search field.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const trackingIdsArray = trackingId
      ? trackingId
          .split(/[\s,]+/) // split by comma or space
          .map((id) => id.trim())
          .filter((id) => id !== "")
      : [];

    const params = {
      shipperId: shipperId || undefined,
      name: name || undefined,
      phone: phone || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    if (trackingIdsArray.length === 1) {
      params.trackingId = trackingIdsArray[0]; // ✅ exact search
    } else if (trackingIdsArray.length > 1) {
      params.trackingIds = trackingIdsArray; // ✅ multiple search
    }

    const response = await axios.get(`${apiUrl}/order/search`, { params });

    const results = Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];

    if (results.length === 0) {
      setOrders([]);
      setError("No orders found.");
    } else {
      setOrders(results);
    }
  } catch (err) {
    console.error(err);
    setError("Failed to fetch orders. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleView = (trackingId) => {
    navigate(`/order/${trackingId}`);
  };

  const handleEdit = (trackingId) => {
    navigate(`/order/edit/${trackingId}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Search</h1>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Shipper ID"
          value={shipperId}
          onChange={(e) => setShipperId(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Tracking IDs (comma or space separated)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="p-2 border rounded-lg md:col-span-3"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Results */}
      {orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-2xl p-4 border"
            >
              <h2 className="text-lg font-semibold mb-2">
                Tracking ID: {order.trackingId}
              </h2>
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {order.cusName} ({order.cusPhone})
              </p>
              <p>
                <span className="font-medium">Shipper:</span>{" "}
                {order.Shipper?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Pickup:</span>{" "}
                {order.pickUpCity?.name}, {order.pickUpCity?.state?.name}
              </p>
              <p>
                <span className="font-medium">Destination:</span>{" "}
                {order.destinationCity?.name},{" "}
                {order.destinationCity?.state?.name}
              </p>
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleView(order.trackingId)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(order.trackingId)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="mt-4">Loading...</p>}
    </div>
  );
};

export default OrderDetailPage;
