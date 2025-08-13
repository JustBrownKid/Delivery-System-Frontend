import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: { ideal: 1200 },
  height: { ideal: 850 },
  facingMode: "environment",
};

const screenshotDimensions = {
  width: 1200,
  height: 730,
};

const Camera = ({ onCaptureChange }) => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);

  const updateParent = useCallback(
    (images) => {
      if (onCaptureChange) {
        onCaptureChange(images);
      }
    },
    [onCaptureChange]
  );

  const capturePhoto = useCallback(() => {
    if (capturedImages.length >= 4 || !webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot(screenshotDimensions);
    if (imageSrc) {
      setCapturedImages((prevImages) => {
        const updated = [...prevImages, imageSrc];
        updateParent(updated);
        return updated;
      });
    }
  }, [capturedImages.length, updateParent]);

  const deletePhoto = (index) => {
    setCapturedImages((prevImages) => {
      const updated = prevImages.filter((_, i) => i !== index);
      updateParent(updated);
      return updated;
    });
  };

  const resetCamera = () => {
    setCapturedImages([]);
    updateParent([]);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        capturedImages.length < 4
      ) {
        event.preventDefault();
        capturePhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [capturePhoto, capturedImages.length]);

  const isCaptureDisabled = capturedImages.length >= 4;

  return (
    <div className="rounded-lg w-full max-w-xl flex flex-col items-center">
      {capturedImages.length < 4 && (
        <div className="w-full px-4 py-2 rounded-md overflow-hidden">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored
            className="w-full h-auto rounded-md"
          />
        </div>
      )}

      {capturedImages.length < 4 && (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={capturePhoto}
            disabled={isCaptureDisabled}
            className={`px-4 py-2 text-white  rounded-lg shadow-md text-sm ${
              isCaptureDisabled
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Capture Photo
          </button>
          <button
            onClick={resetCamera}
            className="px-4 py-2 bg-gray-300 text-sm text-gray-800 rounded-lg shadow-md hover:bg-gray-400"
          >
            Reset All
          </button>
        </div>
      )}

      {capturedImages.length > 0 && (
        <div className="mt-2 w-full">
          <div className="grid grid-cols-2 gap-3">
            {capturedImages.map((imageSrc, index) => (
              <div
                key={index}
                className="relative group rounded-md overflow-hidden shadow"
              >
                <img
                  src={imageSrc}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={() => deletePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0h8"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
