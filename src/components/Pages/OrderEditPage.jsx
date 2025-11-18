import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

// initial order state
const initialOrderState = {
  cusName: "",
  cusPhone: "",
  cusAddress: "",
  pickUpAddress: "",
  pickUpPhone: "",
  pickUpName: "",
  pickUpDate: null,
  pickUpCityId: null,
  cod: 0,
  delivery: true,
  note: "",
  stateId: null,
  cityId: null,
};

const OrderEditPage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [orderEdits, setOrderEdits] = useState(initialOrderState);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  // fetch states, cities, and order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, citiesRes, orderRes] = await Promise.all([
          axios.get(`${apiUrl}/order/state/get`),
          axios.get(`${apiUrl}/order/city/get`),
          axios.get(`${apiUrl}/order/${trackingId}`),
        ]);

        if (statesRes.data.success) setStates(statesRes.data.data);
        if (citiesRes.data.success) setCities(citiesRes.data.data);

        if (orderRes.data.success && orderRes.data.data) {
          const data = orderRes.data.data;
          const stateId = data.destinationCity?.state?.id || null;
          const cityId = data.destinationCity?.id || null;

          const filtered = citiesRes.data.data.filter((c) => c.stateId === stateId);
          setFilteredCities(filtered);

          setOrderEdits({
            cusName: data.cusName || "",
            cusPhone: data.cusPhone || "",
            cusAddress: data.cusAddress || "",
            pickUpAddress: data.pickUpAddress || "",
            pickUpPhone: data.pickUpPhone || "",
            pickUpName: data.pickUpName || "",
            pickUpDate: data.pickUpDate ? dayjs(data.pickUpDate) : null,
            pickUpCityId: data.pickUpCityId || null,
            cod: data.cod || 0,
            delivery: data.delivery ?? true,
            note: data.note || "",
            stateId,
            cityId: filtered.some((c) => c.id === cityId) ? cityId : null,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load order data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, trackingId]); // ✅ no cities dependency to avoid re-fetch loops

  // filter cities when state or query changes
  useEffect(() => {
    if (orderEdits.stateId) {
      const filtered = cities
        .filter((c) => c.stateId === orderEdits.stateId)
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [orderEdits.stateId, query, cities]);

  // handle input changes
  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderEdits((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "cod"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleStateChange = (option) => {
    setOrderEdits((prev) => ({ ...prev, stateId: option?.id || null, cityId: null }));
    setQuery("");
  };

  const handleCityChange = (city) => {
    setOrderEdits((prev) => ({ ...prev, cityId: city?.id || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderEdits.cusName || !orderEdits.cusPhone || !orderEdits.cityId) {
      alert("Customer Name, Phone, and City are required.");
      return;
    }
    try {
      const payload = {
        cusName: orderEdits.cusName,
        cusPhone: orderEdits.cusPhone,
        cusAddress: orderEdits.cusAddress,
        pickUpAddress: orderEdits.pickUpAddress,
        pickUpPhone: orderEdits.pickUpPhone,
        pickUpName: orderEdits.pickUpName,
        pickUpDate: orderEdits.pickUpDate ? orderEdits.pickUpDate.toISOString() : null,
        pickUpCityId: orderEdits.pickUpCityId,
        cod: orderEdits.cod,
        delivery: orderEdits.delivery,
        note: orderEdits.note,
        cityId: orderEdits.cityId,
      };

      await axios.put(`${apiUrl}/order/OrderUpdate/${trackingId}`, payload);
      alert("Order updated successfully!");
      navigate(`/order/${trackingId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update order.");
    }
  };

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";

  const readOnlyInputClass =
    "w-full p-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed";

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pickup Details - Read Only */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Pickup Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" name="pickUpName" value={orderEdits.pickUpName} readOnly className={readOnlyInputClass} />
            <input type="tel" name="pickUpPhone" value={orderEdits.pickUpPhone} readOnly className={readOnlyInputClass} />
            <input type="text" name="pickUpAddress" value={orderEdits.pickUpAddress} readOnly className={readOnlyInputClass} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker label="Pickup Date" value={orderEdits.pickUpDate} disabled className="w-full" />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>

        {/* Customer & Destination - Editable */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Customer and Destination Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input type="text" name="cusName" placeholder="Customer Name *" value={orderEdits.cusName} onChange={handleFieldChange} className={inputClass} required />
            <input type="tel" name="cusPhone" placeholder="Customer Phone *" value={orderEdits.cusPhone} onChange={handleFieldChange} className={inputClass} required />
            <input type="text" name="cusAddress" placeholder="Customer Address" value={orderEdits.cusAddress} onChange={handleFieldChange} className={inputClass} />

            {/* State Dropdown */}
            <div className="relative">
              <Listbox value={states.find((s) => s.id === orderEdits.stateId) || null} onChange={handleStateChange}>
                {({ open }) => (
                  <>
                    <Listbox.Button className={`${inputClass} text-left flex justify-between items-center pr-3 cursor-pointer`}>
                      <span>{orderEdits.stateId ? states.find((s) => s.id === orderEdits.stateId)?.name : "Select a State *"}</span>
                      <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      {states.map((state) => (
                        <Listbox.Option key={state.id} value={state} className={({ active }) => `${active ? "bg-blue-600 text-white" : "text-gray-900"} cursor-pointer select-none py-2 pl-3 pr-4`}>
                          {state.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </>
                )}
              </Listbox>
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <Listbox value={filteredCities.find((c) => c.id === orderEdits.cityId) || null} onChange={handleCityChange} disabled={!orderEdits.stateId}>
                {({ open }) => (
                  <>
                    <Listbox.Button className={`${inputClass} text-left flex justify-between items-center pr-3 cursor-pointer`}>
                      <span>{orderEdits.cityId ? filteredCities.find((c) => c.id === orderEdits.cityId)?.name : "Select a City *"}</span>
                      <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="p-2 sticky top-0 bg-white z-20">
                        <input type="text" placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} className={`${inputClass} w-full`} onClick={(e) => e.stopPropagation()} />
                      </div>
                      {filteredCities.length === 0 ? (
                        <div className="px-4 py-2 text-gray-500">No results found</div>
                      ) : (
                        filteredCities.map((city) => (
                          <Listbox.Option key={city.id} value={city} className={({ active }) => `${active ? "bg-blue-600 text-white" : "text-gray-900"} cursor-pointer select-none py-2 pl-3 pr-4`}>
                            {city.name}
                          </Listbox.Option>
                        ))
                      )}
                    </Listbox.Options>
                  </>
                )}
              </Listbox>
            </div>

            <input type="number" name="cod" placeholder="COD" min="0" value={orderEdits.cod} onChange={handleFieldChange} className={inputClass} />
            <input type="text" name="note" placeholder="Note" value={orderEdits.note} onChange={handleFieldChange} className={inputClass} />

            <div className="flex items-center space-x-2 py-2">
              <input type="checkbox" name="delivery" checked={orderEdits.delivery} onChange={handleFieldChange} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Delivery</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderEditPage;
