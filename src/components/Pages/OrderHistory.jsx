import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [shipperId, setShipperId] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/order/search`, { params });
      let fetchedOrders = response.data.data || [];

      // Limit to 20 results if searching by shipperId
      if (params.shipperId) {
        fetchedOrders = fetchedOrders.slice(0, 20);
      }

      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Load all orders initially
  }, []);

  const handleCheckboxChange = (event) => {
    const orderId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    } else {
      setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      // Unselect all
      setSelectedOrderIds([]);
    } else {
      // Select all
      setSelectedOrderIds(orders.map(order => order.id.toString()));
    }
  };

  const handleSearch = () => {
    const params = {};

    if (shipperId) params.shipperId = shipperId;

    if (trackingId) {
      const trackingIdsArray = trackingId
        .split(/\s|,+/)
        .map(id => id.trim())
        .filter(id => id !== '');
      params.trackingId = trackingIdsArray.join(',');
    }

    fetchOrders(params);
  };

  const handlePrintSelected = () => {
    const selectedOrders = orders.filter(order =>
      selectedOrderIds.includes(order.id.toString())
    );

    navigate('/awb-print', { state: { orders: selectedOrders } });
  };

  return (
    <div className="order-history-container h-screen overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order History</h1>

      {/* Search Inputs */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-3 md:space-y-0 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter Shipper ID"
            value={shipperId}
            onChange={(e) => setShipperId(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full   "
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter Tracking IDs (comma or space separated)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full "
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleSelectAll}
          disabled={orders.length === 0}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
        >
          {selectedOrderIds.length === orders.length && orders.length > 0
            ? 'Unselect All'
            : 'Select All'}
        </button>

        {selectedOrderIds.length > 0 && (
          <button
            onClick={handlePrintSelected}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Print AWB ({selectedOrderIds.length})
          </button>
        )}
      </div>

      {/* Loading / Error / No Orders */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && orders.length === 0 && <div>No orders found.</div>}

      {/* Orders List */}
      <ul className="space-y-4">
        {orders.map(order => (
          <li
            key={order.id}
            className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{order.cusName}</h3>
              <p className="text-sm text-gray-600">{order.cusPhone}</p>
              <p className="text-sm text-gray-600">{order.cusAddress}</p>
              <p className="text-sm text-gray-500">
                {order.destinationCity?.name}, {order.destinationCity?.state?.name}
              </p>
            </div>
            <input
              type="checkbox"
              value={order.id}
              onChange={handleCheckboxChange}
              checked={selectedOrderIds.includes(order.id.toString())}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
