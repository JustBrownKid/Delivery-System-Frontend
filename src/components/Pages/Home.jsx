import React, { useState } from 'react'
import Webcam from '../Pages/Webcam'
import logo from '../../assets/two.png'
import Order from './Order'
import OrderHistory from './OrderHistory'
import OrderDetailPage from './OrderDetail'

const Sidebar = ({ onNavigate, currentPage }) => {
  const navItemClass = (page) =>
    `flex items-center space-x-3 cursor-pointer py-4 px-6 rounded-xl transition-colors duration-200 ${currentPage === page ? 'bg-blue-600 text-white shadow-inner font-bold' : 'hover:bg-gray-700'
    }`

  const handleLogout = () => {
    localStorage.removeItem('token')   // remove token
    window.location.href = '/login'    // redirect to login page (or change route based on your app)
  }

  return (
    <nav className="w-64 bg-gray-900 text-white flex-shrink-0 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-10">
          <img src={logo} alt="Dome Logo" className="h-20 w-auto" />
        </div>
        <ul className="space-y-4">
          <li className={navItemClass('createOrder')} onClick={() => onNavigate('createOrder')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Create Order</span>
          </li>
          <li className={navItemClass('detail')} onClick={() => onNavigate('detail')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10m0 0h16m0 0V7m-9 4h3m-3 4h3m0 0h-3m3 0v4m-3-4v4"
              />
            </svg>
            <span>Parcel Detail</span>
          </li>
          <li className={navItemClass('orderHistory')} onClick={() => onNavigate('orderHistory')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Airway Print</span>
          </li>
          <li className={navItemClass('parcelSizing')} onClick={() => onNavigate('parcelSizing')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10m0 0h16m0 0V7m-9 4h3m-3 4h3m0 0h-3m3 0v4m-3-4v4"
              />
            </svg>
            <span>Parcel Sizing</span>
          </li>
        </ul>
      </div>

      {/* Logout Button at the Bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 w-fit py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 transition-colors duration-200 mt-10"
      >
        <span>Logout</span>
      </button>
    </nav>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('createOrder')
  const [orderData, setOrderData] = useState({})
  const [pickUp, setPickUp] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'createOrder':
        return (
          <div className="h-screen">
            <Order />
          </div>
        )
      case 'detail':
        return (
          <div className="h-screen">
            <OrderDetailPage />
          </div>
        )
      case 'orderHistory':
        return (
          <div className="h-screen">
            <OrderHistory />
          </div>
        )
      case 'parcelSizing':
        return <Webcam />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  )
}
