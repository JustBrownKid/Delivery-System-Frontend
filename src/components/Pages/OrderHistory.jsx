import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/order`);
                setOrders(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch orders.");
                setLoading(false);
            }
        };

        fetchOrders();
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

    const handleLogSelected = () => {
        const ordersToLog = orders.filter(order => selectedOrderIds.includes(order.id.toString()));
        console.log('Selected Orders:', ordersToLog);
    };

    if (loading) {
        return <div>Loading order history...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!orders || orders.length === 0) {
        return <div>No orders found.</div>;
    }

    return (
        <div className="order-history-container h-screen overflow-y-scroll p-4">
            <h1 className="text-2xl font-bold mb-4">Order History</h1>
            
            <div className="mb-4">
                <button 
                    onClick={handleLogSelected}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Log Selected Orders
                </button>
            </div>

            <ul className="space-y-4">
                {orders.map(order => (
                    <li key={order.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{order.cusName}</h3>
                            </div>
                            <div className="">
                                <p className="text-sm text-gray-700">{order.cusPhone}</p>
                                <p className="text-sm text-gray-700">{order.cusAddress}</p>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center">
                                    {order.destinationCity.name}, {order.destinationCity.state.name}
                                </div>
                            </div>
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
