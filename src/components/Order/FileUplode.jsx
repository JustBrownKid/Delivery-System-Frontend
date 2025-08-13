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

const FileUpload = ({ setFileData }) => {
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
    </div>
  );
};

export default FileUpload;
