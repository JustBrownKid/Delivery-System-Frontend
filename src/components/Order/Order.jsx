import React, { useState } from "react";
import PickUp from "./PickUp";
import OrderCreation from "./OrderCreation";

export const Order = () => {
  const [pickUpData, setPickUpData] = useState(null);
  const [pickUpConfirmed, setPickUpConfirmed] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmitOrders = (orderInfo) => {
    const combinedData = {
      pickUp: pickUpData,
      orders: orderInfo.orders,
      inputMode: orderInfo.inputMode,
    };
    setSubmittedData(combinedData);
    console.log("Submitted Orders:", combinedData);
  };

  return (
    <div className="p-6">
      <PickUp setPickUpData={setPickUpData} setPickUp={setPickUpConfirmed} />

      {pickUpConfirmed && pickUpData && (
        <OrderCreation orderData={pickUpData} onSubmit={handleSubmitOrders} />
      )}

      {submittedData && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Submitted Data</h2>
          <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Order;
