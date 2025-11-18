import React, { useState } from "react";
import PickUp from "../Order/PickUp";
import OrderCreation from "../Order/OrderCreation";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import dayjs from 'dayjs';

export const Order = () => {
    const [pickUpData, setPickUpData] = useState(null);
    const [pickUpConfirmed, setPickUpConfirmed] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [orderIsCreated, setOrderIsCreated] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const formatSubmittedData = (data) => {
        const { shipper, orders } = data;

        const formattedDate = dayjs.isDayjs(shipper.pickupDate)
            ? shipper.pickupDate.toISOString()
            : shipper.pickupDate || "2024-08-15T10:00:00Z";

        return {
            shipperId: shipper.shipperId,
            pickUpAddress: shipper.pickUpAddress || "Common PickUp Address, Yangon",
            pickUpDate: formattedDate,
            pickUpPhone: shipper.pickUpPhone || "09987654321",
            pickUpName: shipper.pickUpName || "Common Shipper Name",
            pickUpCityId: shipper.pickUpCityId || 4,
            orders: orders.map(order => ({
                ...order,
                cusPhone: String(order.cusPhone),
                cityId: order.cityId || 1
            })),
        };
    };

    const handleSubmitOrders = async (orderInfo) => {
        const combinedData = formatSubmittedData({ shipper: pickUpData, orders: orderInfo.orders });

        setSubmittedData(combinedData);
        console.log("Final Combined Data:", combinedData);
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await axios.post(`${apiUrl}/order/upload`, combinedData);
            console.log("Response from server:", res.data);
            setSubmittedData(combinedData);
            setPickUpConfirmed(false);
            setPickUpData(null);
            setOrderIsCreated(true);
            navigate('/');
        } catch (err) {
            console.error("Order submission failed:", err);
            alert(err.response?.data?.message || 'Order submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {!orderIsCreated && (
                <PickUp setPickUpData={setPickUpData} setPickUp={setPickUpConfirmed} />
            )}

            {pickUpConfirmed && pickUpData && (
                <OrderCreation orderData={pickUpData} onSubmit={handleSubmitOrders} />
            )}
        </div>
    );
};

export default Order;