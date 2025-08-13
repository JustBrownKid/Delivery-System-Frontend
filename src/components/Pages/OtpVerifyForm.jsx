import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerifyForm = ({ email }) => {
  const [otpDigits, setOtpDigits] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const otp = otpDigits.join('');

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);


  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = val;
    setOtpDigits(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otpDigits.some(digit => digit.trim() === '')) {
      setAlert({ type: 'error', message: 'Please enter all 6 digits of the OTP' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/users/verify`, {
        email,
        otp, 
      });

      setAlert({ type: 'success', message: res.data.message });
      
      const receivedToken = res.data.data.token; 
      if (receivedToken) {
        localStorage.setItem('token', receivedToken); // Store the received token
      } else {
        console.warn('No token received after OTP verification.');
      }

      setTimeout(() => {
        navigate('/home'); 
      }, 1000);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'OTP verification failed',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto mt-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Verify OTP</h2>
        <p className="text-gray-600 text-sm mb-2">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        {alert && (
          <div
            className={`p-3 rounded-md text-sm font-medium ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } flex justify-between items-center`}
            role="alert"
          >
            <span>{alert.message}</span>
            <button
              type="button"
              onClick={() => setAlert(null)}
              className="ml-4 text-lg font-bold leading-none focus:outline-none"
              aria-label="Dismiss alert"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex justify-between space-x-2">
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#524DDA] text-white font-semibold rounded-md hover:bg-[#FFBC49] transition duration-200"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

      </form>
    </div>
  );
};

export default OtpVerifyForm;
