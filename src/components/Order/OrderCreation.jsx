import React, { useState, useEffect } from 'react';
import FormUplode from './FormUplode';
import FileUpload from './FileUplode';

export const OrderCreation = ({ orderData, onSubmit }) => {
  const [inputMode, setInputMode] = useState('manual');
  const [formData, setFormData] = useState([]);
  const [fileData, setFileData] = useState([]);

  const hasData = inputMode === 'manual' ? formData.length > 0 : fileData.length > 0;

  const handleSubmit = () => {
    const orders = inputMode === 'manual' ? formData : fileData;

    onSubmit({
      shipper: orderData || {},
      orders,
      inputMode,
    });

    setFormData([]);
    setFileData([]);
  };

  return (
    <div className="font-sans p-6 w-full mx-auto">
      <div className="flex bg-blue-200 rounded-full p-1.5 w-full mb-6">
        {['manual', 'file'].map((mode) => (
          <label
            key={mode}
            className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
              inputMode === mode ? 'bg-white shadow' : 'text-gray-700'
            }`}
          >
            <input
              type="radio"
              name="inputMode"
              value={mode}
              checked={inputMode === mode}
              onChange={() => setInputMode(mode)}
              className="hidden"
            />
            <span className="font-medium">
              {mode === 'manual' ? 'Manual Form' : 'Use File Upload'}
            </span>
          </label>
        ))}
      </div>

      {inputMode === 'manual' && <FormUplode setFormData={setFormData} />}

      {inputMode === 'file' && (
        <>
          <FileUpload setFileData={setFileData} />
          {fileData.length > 0 && (
            <div className="mb-4">
              <label className="font-semibold mb-2 block">Uploaded Orders:</label>
              <pre className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                {JSON.stringify(fileData, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

      {hasData && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit Orders
        </button>
      )}
    </div>
  );
};

export default OrderCreation;
