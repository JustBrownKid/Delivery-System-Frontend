import React, { useRef } from 'react';
import Awb from '../Awb/Awb';

const AwbPrint = () => {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div ref={printRef} className="print-section">
        <Awb />
      </div>

      <button
        onClick={handlePrint}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
      >
        Print AWB Only
      </button>
    </div>
  );
};

export default AwbPrint;
