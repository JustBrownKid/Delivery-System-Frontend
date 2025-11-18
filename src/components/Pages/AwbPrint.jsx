import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Awb from '../Awb/Awb';

const AwbPrint = () => {
  const printRef = useRef();
  const location = useLocation();
  const orders = location.state?.orders || [];

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  return (
    <div className="p-4">
      <div ref={printRef} className="print-section">
        {orders.length === 0 ? (
          <p>No orders selected to print.</p>
        ) : (
          orders.map(order => <Awb key={order.id} order={order} />)
        )}
      </div>

      {orders.length > 0 && (
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
        >
          Print AWB
        </button>
      )}
    </div>
  );
};

export default AwbPrint;
