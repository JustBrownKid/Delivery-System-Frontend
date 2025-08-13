import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/two.png'

const LoginForm = ({ onOtpSent ,token }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/users/login`, form, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.token) {
        token(res.data.token);
      }

      onOtpSent(form.email);

      navigate('/verify-otp'); 
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Login failed',
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white-300 p-6 rounded-lg shadow-lg shadow-gray-400 w-full max-w-md mx-auto space-y-4"
      >
        <div className="flex justify-center">
            <img src={logo} alt="Dome Logo" className="h-20 w-auto" />
            
        </div>

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
              onClick={() => setAlert(null)}
              className="ml-4 text-lg font-bold leading-none focus:outline-none"
              aria-label="Dismiss alert"
              type="button"
            >
              &times;
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#524DDA]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#524DDA]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#524DDA] text-white font-semibold rounded-md hover:bg-[#FFBC49] transition duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
