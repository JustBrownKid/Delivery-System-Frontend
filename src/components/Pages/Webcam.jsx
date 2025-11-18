import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Camera from "../webcam/Camera";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [kgValue, setKgValue] = useState("");
  const [cmValue, setCmValue] = useState("");
  const [isKgEditable, setIsKgEditable] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [submittedRecords, setSubmittedRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const kgInputRef = useRef(null);
  const trackingInputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length === 5) {
      setShowCamera(true);
      setKgValue(value);
    } else {
      setShowCamera(false);
    }
  };

  const closeCamera = useCallback(() => {
    setShowCamera(false);
    setInputValue("");
    setCmValue("");
    setKgValue("");
    setImages([]);
    setIsKgEditable(false);
    setMessage("");
  }, []);

  const handleImageCapture = (newImages) => setImages(newImages);

  const handleSubmit = useCallback(() => {
    const trackingValue = trackingInputRef.current?.value.trim();

    if (!trackingValue || !kgValue.trim() || images.length === 0) {
      setMessage("All fields are required");
      return;
    }

    const newRecord = {
      trackingId: trackingValue,
      kg: parseFloat(kgValue), // Use 'kg' as the key
      cm: parseFloat(cmValue) || null, // Use 'cm' as the key
      images,
      timestamp: new Date().toLocaleString(),
    };

    setSubmittedRecords((prev) => [...prev, newRecord]);
    console.log("New record submitted:", newRecord);
    closeCamera();
  }, [kgValue, cmValue, images, closeCamera]);

  const handleMainSubmit = useCallback(async () => {
    if (submittedRecords.length === 0) {
      setMessage("No records to submit.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const apiUrl2 = `${apiUrl}/oswm`;

    try {
      await Promise.all(
        submittedRecords.map(async (record) => {
          const payload = {
            trackingId: record.trackingId,
            kg: record.kg, // Corrected to use 'kg'
            cm: record.cm, // Corrected to use 'cm'
            // NOTE: You'll need to fetch the OrderId based on the trackingId.
            // This is a placeholder. You must replace this logic.
            OrderId: 123,
            Images: record.images,
          };

          const response = await axios.post(apiUrl2, payload);
          console.log(`Successfully posted record for ${record.trackingId}:`, response.data);
        })
      );

      setMessage("All records submitted successfully!");
      setSubmittedRecords([]);
    } catch (error) {
      console.error("Failed to submit one or more records:", error);
      setMessage("Error: Failed to submit all records. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }, [submittedRecords]);

  const handleDelete = (index) => {
    setSubmittedRecords((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        handleMainSubmit();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleImageCapture([]);
      }
      if (e.key === "Enter" && showCamera) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMainSubmit, handleSubmit, showCamera]);

  useEffect(() => {
    if (isKgEditable && kgInputRef.current) {
      kgInputRef.current.focus();
    }
  }, [isKgEditable]);

  useEffect(() => {
    if (showCamera && trackingInputRef.current) {
      trackingInputRef.current.focus();
    }
  }, [showCamera]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 font-sans">
      {/* Keyboard shortcut info */}
      <div className="flex flex-wrap space-x-6 text-sm mb-5 text-gray-600">
        <div className="flex items-center space-x-2">
          <kbd className="px-3 py-2 text-sm text-black bg-gray-200 border border-gray-300 rounded">
            Enter
          </kbd>
          <span>Submit Record</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 text-sm fo text-black bg-gray-200 border border-gray-300 rounded">
            Ctrl + Q
          </kbd>
          <span>Submit All</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 text-sm text-black bg-gray-200 border border-gray-300 rounded">
            Ctrl + Z
          </kbd>
          <span>Capture Images</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">
            Only 5 records allowed. Please submit before adding more.
          </span>
        </div>
      </div>

      {/* Input and submit all button */}
      <div className="flex justify-between items-center w-full space-x-2">
        {submittedRecords.length >= 5 ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            <strong className="font-bold">Alert!</strong>
            <span> You have 5 records ready to submit.</span>
          </div>
        ) : (
          <input
            id="input-value"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter 5 chars"
            className="px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={5}
          />
        )}

        {submittedRecords.length > 0 && (
          <button
            onClick={handleMainSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Submit All"}
          </button>
        )}
      </div>

      {message && <p className="text-sm mt-2 font-semibold">{message}</p>}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <button
              onClick={closeCamera}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              ✕
            </button>

            <label htmlFor="tracking" className="text-sm text-gray-700">
              Tracking
            </label>
            <input
              ref={trackingInputRef}
              id="tracking"
              type="text"
              placeholder="Enter Tracking"
              className="px-4 py-2 w-full text-sm border border-gray-300 rounded-lg"
            />

            <div className="flex space-x-4 w-full justify-center mt-4">
              <div>
                <label htmlFor="kg-input" className="text-sm text-gray-700 mb-1">
                  Kg
                </label>
                <input
                  ref={kgInputRef}
                  id="kg-input"
                  type="number"
                  value={kgValue}
                  onChange={(e) => setKgValue(e.target.value)}
                  onDoubleClick={() => setIsKgEditable(true)}
                  readOnly={!isKgEditable}
                  className={`px-3 py-2 border rounded-lg w-46 text-sm ${!isKgEditable
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
                    : "bg-white text-gray-900"
                    }`}
                />
              </div>

              <div>
                <label htmlFor="cm-input" className="text-sm text-gray-700 mb-1">
                  CM
                </label>
                <input
                  id="cm-input"
                  type="number"
                  value={cmValue}
                  onChange={(e) => setCmValue(e.target.value)}
                  placeholder="Enter cm"
                  className="px-3 py-2 w-46 text-sm border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Camera onCaptureChange={handleImageCapture} />
            </div>

            {message && <p className="text-red-600 text-sm mt-2">{message}</p>}

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 w-full bg-blue-600 text-white rounded-lg text-sm shadow-md hover:bg-blue-700"
            >
              Submit Record
            </button>
          </div>
        </div>
      )}

      {/* Submitted Records List */}
      {submittedRecords.length > 0 && (
        <div className="w-full mt-4 overflow-y-auto bg-white px-6 rounded-xl shadow-lg max-h-80">
          <ul>
            {submittedRecords.map((record, index) => (
              <li
                key={index}
                className="border-b last:border-b-0 py-4 flex items-center justify-between"
              >
                <div className="flex space-x-5">
                  <p>
                    Tracking ID: <strong>{record.trackingId}</strong>
                  </p>
                  <p>
                    KG: <strong>{record.kg} kg</strong>
                  </p>
                  {record.cm && (
                    <p>
                      CM: <strong>{record.cm} cm</strong>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 w-9 ml-3 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
                  aria-label="Delete record"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}