import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./components/Pages/LoginForm";
import OtpVerifyForm from "./components/Pages/OtpVerifyForm";
import Home from "./components/Pages/Home";
import AwbPrint from "./components/Pages/AwbPrint";
import OrderDetailPage from "./components/Pages/OrderDetail";
import OrderViewPage from "./components/Pages/OrderViewPage";
import OrderEditPage from "./components/Pages/OrderEditPage";

import PrivateRoute from "./components/Security/PrivateRoute";
import PublicRoute from "./components/Security/PublicRoute";

function App() {
  const [otpEmail, setOtpEmail] = useState(null);
  const [token, setToken] = useState(null);

  const clearOtpEmail = () => setOtpEmail(null);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginForm onOtpSent={setOtpEmail} token={setToken} />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-otp"
          element={
            otpEmail ? (
              <OtpVerifyForm
                email={otpEmail}
                token={token}
                onBack={clearOtpEmail}
                onVerified={clearOtpEmail}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />


        <Route
          path="/order/:trackingId"
          element={
            <PrivateRoute>
              <OrderViewPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/order/edit/:trackingId"
          element={
            <PrivateRoute>
              <OrderEditPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/awb-print"
          element={
            <PrivateRoute>
              <AwbPrint />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
