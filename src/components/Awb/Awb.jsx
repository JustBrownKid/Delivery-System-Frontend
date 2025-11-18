import React, { useEffect, useState } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import axios from 'axios';

export default function DomeLabel({ order }) {
  const [kg, setKg] = useState(null);
  const [cm, setCm] = useState(null);

  useEffect(() => {
    if (!order) return;

    const fetchDimensions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/oswm/${order.trackingId}`);
        if (response.data.success) {
          setKg(response.data.data.kg);
          setCm(response.data.data.cm);
        }
      } catch (error) {
        console.error('Failed to fetch dimensions:', error);
      }
    };

    fetchDimensions();
  }, [order]);

  if (!order) return null;

  const deliveryFee = order.deliFee ?? order.destinationCity?.fee ?? 'N/A';

  return (
    <div className="w-[105mm] h-[148mm] mx-auto border-gray-300 font-sans text-[8px] leading-tight bg-gray-50 p-3 flex flex-col justify-between border-dashed  border-[5px]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-2">
        <div className="text-sm text-gray-800">DOM - MDY - A01</div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-800">Dome</span>
        </div>
      </div>
      
      {/* Barcode */}
      <div className="flex justify-center py-2 border-b-[1px] border-gray-400">
        <img
          src={`https://barcode.tec-it.com/barcode.ashx?data=${order.trackingId}&code=Code128&translate-esc=false`}
          alt="Barcode"
          className="h-12"
        />
      </div>

      {/* Sender */}
      <div className="grid grid-cols-[max-content_1fr] border-b-[1px] border-gray-400 py-3">
        <div className="flex items-center justify-center p-2">
          <div className="rotate-[270deg] whitespace-nowrap text-sm text-gray-700">Sender</div>
        </div>
        <div className="space-y-1 pl-2">
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaUser className="text-[10px] text-gray-500" /> {order.pickUpName}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaPhone className="text-[10px] text-gray-500" /> {order.pickUpPhone}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaMapMarkerAlt className="text-[10px] text-gray-500" /> {order.pickUpAddress}, {order.pickUpCity?.name}
          </p>
        </div>
      </div>

      {/* Receiver */}
      <div className="grid grid-cols-[max-content_1fr] border-b-[1px] border-gray-400 py-3">
        <div className="flex items-center justify-center p-2">
          <div className="rotate-[270deg] whitespace-nowrap text-sm text-gray-700">Receiver</div>
        </div>
        <div className="space-y-1 pl-2">
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaUser className="text-[10px] text-gray-500" /> {order.cusName}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaPhone className="text-[10px] text-gray-500" /> {order.cusPhone}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-800">
            <FaMapMarkerAlt className="text-[10px] text-gray-500" /> {order.cusAddress}, {order.destinationCity?.name}
          </p>
        </div>
      </div>
{/* COD / Delivery Fee / Total / Dimensions */}
<div className="border-b-[1px] border-gray-400 text-gray-800 p-2 space-y-2">
  {/* Row 1: Delivery Fee | COD */}
  <div className="grid grid-cols-2 text-sm border-b-[1px] border-gray-300 pb-2">
    <div className="text-left">Delivery Fee : {deliveryFee}</div>
    <div className="text-right">COD : {order.cod}</div>
  </div>

  {/* Row 2: Left (Total COD + KG/CM) and Right (QR) */}
  <div className="grid grid-cols-2 gap-2 items-center">
    {/* Left column: stacked Total COD and KG/CM */}
    <div className="flex flex-col text-sm border-r-[1px] border-gray-300 pr-2">
      <div className="pb-1 text-center">Total COD : {order.totalCod}</div>
      <div className="grid grid-cols-2 text-center">
        <div className="border-r-[1px] border-gray-300">KG {kg ?? "---"}</div>
        <div>CM {cm ?? '---'}</div>
      </div>
    </div>

    {/* Right column: QR Code */}
    <div className="flex items-center justify-center">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?data=${order.trackingId}&size=70x70`}
        alt="QR Code"
        className="h-20 w-20"
      />
    </div>
  </div>
</div>




      {/* Footer */}
      <div className="flex justify-between px-8 text-xs  text-gray-700">
        <p>09788889337</p>
        <p>Create at : {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
