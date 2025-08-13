import React from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function DomeLabel() {
  return (
    <>
      {/* Styles for print and layout */}
     
      
      {/* The main A6 size container for the shipping label */}
      <div className="w-[105mm] h-[148mm] mx-auto border-[1px] border-gray-300 font-sans text-[8px] leading-tight bg-gray-50 p-3 flex flex-col justify-between rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-2">
          <div className="font-extrabold text-sm text-gray-800">DOM - MDY - A01</div>
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 10a.5.5 0 100-1 .5.5 0 000 1z" />
              <path fillRule="evenodd" d="M.998 10a1 1 0 011-1h1.037l-1.077-.45a1 1 0 01-.197-1.127l.58-1.16a1 1 0 01.996-.583l1.838.307-1.579-1.92-1.18.983a1 1 0 01-1.228-1.564l1.636-1.364a1 1 0 011.385.127l1.188 1.446 1.405-1.992a1 1 0 01.815-.411h2.825a1 1 0 01.815.411l1.405 1.992 1.188-1.446a1 1 0 011.385-.127l1.636 1.364a1 1 0 01-1.228 1.564l-1.18-.983-1.58 1.92 1.838-.307a1 1 0 01.996.583l.58 1.16a1 1 0 01-.197 1.127l-1.076.45H18.98a1 1 0 011 1v2a1 1 0 01-1 1H2.018a1 1 0 01-1-1v-2zM14 9a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm text-gray-800">Dome</span>
          </div>
        </div>
        
        {/* Barcode */}
        <div className="flex justify-center py-2 border-b-[1px] border-gray-400">
          <img
            src="https://barcode.tec-it.com/barcode.ashx?data=DOME12345678910111213&code=Code128&translate-esc=false"
            alt="Barcode"
            className="h-12"
          />
        </div>

        {/* Tracking ID */}
        <div className="text-center font-extrabold border-b-[1px] border-gray-400 py-2 text-sm text-gray-800">
          TRACKING ID : DOME12345678910111213
        </div>

        {/* Sender */}
        <div className="grid grid-cols-[max-content_1fr] border-b-[1px] border-gray-400 py-3">
          <div className="flex items-center justify-center p-2">
            <div className="font-extrabold rotate-[270deg] whitespace-nowrap text-sm text-gray-700">Sender</div>
          </div>
          <div className="space-y-1 pl-2">
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaUser className="text-[10px] text-gray-500" /> <span className="font-extrabold">791234 - Brownsley Br Nyar Shop</span>
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaPhone className="text-[10px] text-gray-500" /> <span className="font-extrabold">+959788889337</span>
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaMapMarkerAlt className="text-[10px] text-gray-500" /> Mandalay, Aunmyaythazan, 115-70B
            </p>
          </div>
        </div>

        {/* Receiver */}
        <div className="grid grid-cols-[max-content_1fr] border-b-[1px] border-gray-400 py-3">
          <div className="flex items-center justify-center p-2">
            <div className="font-extrabold rotate-[270deg] whitespace-nowrap text-sm text-gray-700">Receiver</div>
          </div>
          <div className="space-y-1 pl-2">
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaUser className="text-[10px] text-gray-500" /> <span className="font-extrabold">Brown kid</span>
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaPhone className="text-[10px] text-gray-500" /> <span className="font-extrabold">+959788889337</span>
            </p>
            <p className="flex items-center gap-1 text-sm text-gray-800">
              <FaMapMarkerAlt className="text-[10px] text-gray-500" /> Mandalay, Aunmyaythazan, 115-70B
            </p>
          </div>
        </div>

        {/* Pricing and KG/CM combined section */}
        <div className="grid grid-cols-2 border-b-[1px] border-gray-400 text-center text-gray-800">
          <div className="flex flex-col border-r-[1px] border-gray-400 p-2">
            {/* Pricing Row */}
            <div className="grid grid-cols-2 text-center font-bold text-base pb-1">
              <div className="border-r-[1px] border-gray-400">18,500</div>
              <div>1,000,000</div>
            </div>
            {/* COD Row */}
            <div className="border-t-[1px] border-gray-400 pt-1 pb-1 text-base">
              COD : <span className="font-extrabold">1,018,500</span>
            </div>
            {/* Dimensions Row */}
            <div className="grid grid-cols-2 text-center font-bold text-sm border-t-[1px] border-gray-400 pt-1">
              <div className="border-r-[1px] border-gray-400">KG 13.32</div>
              <div>CM 120</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-1">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?data=DOME12345678910111213&size=70x70"
              alt="QR Code"
              className="h-20 w-20"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between text-xs pt-2 font-extrabold text-gray-700">
          <p>+959788889337</p>
          <p>Create at : 2025-08-08</p>
        </div>
      </div>

     

      {/* Print button outside the A6 container */}
      
    </>
  );
}
