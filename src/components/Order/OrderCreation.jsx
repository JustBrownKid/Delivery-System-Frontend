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
    });
    console.log("Submitted Orders:", {
      shipper: orderData || {},
      orders,
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
            className={`flex-1 text-center cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${inputMode === mode ? 'bg-white shadow' : 'text-gray-700'
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
          {fileData && fileData.length > 0 && (
            <div>
              {fileData && fileData.length > 0 && (
                <div>
                  <label className="font-semibold mb-2 block">Uploaded Orders:</label>
                  <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            COD
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delivery
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fileData.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.cusName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.cusPhone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.cusAddress}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.cod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.delivery ? 'Yes' : 'No'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.note}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
