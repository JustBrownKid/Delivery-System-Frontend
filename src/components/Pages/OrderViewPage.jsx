import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DomeLabel from "../Awb/Awb";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative p-4 max-w-4xl max-h-full">
        <button
          className="absolute top-4 right-4 text-white text-4xl font-bold p-2"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Enlarged parcel"
          className="max-w-full max-h-[80vh] object-contain cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const OrderViewPage = () => {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [oswmData, setOswmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const printRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrderAndOswm = async () => {
      try {
        setLoading(true);
        const orderResponse = await axios.get(`${apiUrl}/order/${trackingId}`);
        const fetchedOrder = orderResponse.data.data;
        setOrder(fetchedOrder);

        const oswmResponse = await axios.get(`${apiUrl}/oswm/${trackingId}`);
        setOswmData(oswmResponse.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load order or associated data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderAndOswm();
  }, [trackingId, apiUrl]);

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  if (loading) return <div className="p-6 max-w-5xl mx-auto">Loading...</div>;
  if (error)
    return (
      <div className="p-6 max-w-5xl mx-auto text-red-500">{error}</div>
    );
  if (!order) return <div className="p-6 max-w-5xl mx-auto">No order found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <div className="bg-white rounded-2xl p-6 grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                Sender Information
              </h2>
              <p>
                <strong>Name:</strong> {order.Shipper?.name} 
              </p>
              <p>
                <strong>Phone:</strong> {order.Shipper?.phone}
              </p>
              <p>
                <strong>State and City:</strong> {order.pickUpCity?.name},{" "}
                {order.pickUpCity?.state?.name}
              </p>
              <p>
                <strong>Pickup Address:</strong> {order.pickUpAddress}
              </p>
            </div>
            <div className="space-y-4 pt-6 mt-6 border-t">
              <h2 className="text-lg font-semibold border-b pb-2">
                Receiver Information
              </h2>
              <p>
                <strong>Name:</strong> {order.cusName}
              </p>
              <p>
                <strong>Phone:</strong>{order.cusPhone}
              </p>
              <p>
                <strong>State and City:</strong> {order.destinationCity?.name},{" "}
                {order.destinationCity?.state?.name}
              </p>
              <p>
                <strong>Address:</strong> {order.cusAddress}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>COD :</strong> {order.cod || "0"}
              </p>
              <p>
                <strong>Delivery Fee:</strong>
                {order.destinationCity?.fee}
              </p>
              
              <p>
                <strong>Total COD:</strong> {order.totalCod || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-start md:items-end">
          {oswmData && (
            <div className="bg-white rounded-2xl p-6 w-full mb-6">
              <h3 className="text-xl font-semibold mb-2">
                Parcel Sizing Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <p>
                  <strong>Weight:</strong>{" "}
                  <span className="text-lg font-bold">
                    {oswmData.kg} kg
                  </span>
                </p>
                <p>
                  <strong>Dimensions:</strong>{" "}
                  <span className="text-lg font-bold">
                    {oswmData.cm} cm
                  </span>
                </p>
                <p>
                <strong>Update Delivery Fee:</strong>{" "}
                {order.deliFee || "---"}
              </p>
              </div>
              {oswmData.Images && oswmData.Images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Parcel Images:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {oswmData.Images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Parcel Image ${index + 1}`}
                        className="w-full h-auto object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 rounded-lg bg-gray-50 w-full">
            <div ref={printRef} className="print-section">
              <h3 className="text-xl font-bold mb-4">
                Air Waybill (AWB)
              </h3>
              <DomeLabel order={order} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full md:w-auto"
              >
                Print AWB
              </button>
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default OrderViewPage;