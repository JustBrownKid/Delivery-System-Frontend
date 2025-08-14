import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const expectedFields = [
  "cusName",
  "cusPhone",
  "cusAddress",
  "cod",
  "delivery",
  "note",
  "cityId",
];

const normalizeDelivery = (val) => {
  if (typeof val === "string") {
    val = val.toLowerCase();
    return val === "true" || val === "yes";
  }
  return Boolean(val);
};

const FileUpload = ({ setFileData, fileData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryString = event.target.result;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length < 2) {
          throw new Error("File contains no data rows");
        }

        const headers = rawData[0].map((h) => h.trim());
        const dataRows = rawData.slice(1);

        const formatted = dataRows.map((row) => {
          let obj = {};
          headers.forEach((header, i) => {
            const key = expectedFields.find(
              (f) => f.toLowerCase() === header.toLowerCase()
            );
            if (key) {
              obj[key] = row[i];
            }
          });

          obj.cod = Number(obj.cod) || 0;
          obj.delivery = normalizeDelivery(obj.delivery);
          obj.cityId = Number(obj.cityId) || null;

          return obj;
        });

        setFileData(formatted);
      } catch (err) {
        setError("Error parsing file: " + err.message);
        setFileData([]);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file!");
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileData([]);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {!selectedFile ? (
        <label
          htmlFor="excel-upload"
          className="flex flex-col items-center justify-center border-4 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:border-violet-500 transition-colors"
        >
          <span className="text-gray-600 text-center">
            Click or drag file to upload <br />
            <small className="text-xs">Supported: .xlsx, .xls, .csv</small>
          </span>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      ) : (
        <div className="bg-violet-50 border border-violet-400 text-violet-800 p-4 rounded-lg flex justify-between items-center">
          <div>
            {/* This will now be safe because selectedFile is an object */}
            <p className="font-semibold">{selectedFile.name}</p>
            {loading && <p className="text-sm text-gray-600">Processing...</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>
          <button
            onClick={handleRemoveFile}
            className="text-violet-600 hover:text-violet-900 font-bold"
            aria-label="Remove selected file"
          >
            ✕
          </button>
        </div>
      )}
      {selectedFile && !loading && !error && Array.isArray(fileData) && fileData.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">Uploaded Data</h3>
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {fileData.map((item, index) => (
              <li key={index} className="py-2">
                <p>
                  <span className="font-semibold">Customer Name:</span>{" "}
                  {item.cusName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {item.cusPhone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {item.cusAddress}
                </p>
                <p>
                  <span className="font-semibold">COD:</span> {item.cod}
                </p>
                <p>
                  <span className="font-semibold">Delivery:</span>{" "}
                  {item.delivery ? "Yes" : "No"}
                </p>
                <p>
                  <span className="font-semibold">City ID:</span> {item.cityId}
                </p>
                <p>
                  <span className="font-semibold">Note:</span> {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty data message */}
      {selectedFile && !loading && !error && Array.isArray(fileData) && fileData.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          No valid data found in the file.
        </div>
      )}
    </div>
  );
};

export default FileUpload;