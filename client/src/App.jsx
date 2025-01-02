import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ date: '', time: '', guests: '', name: '', contact: '' });
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'date') {
      fetchAvailableSlots(value);
    }
  };

  const fetchAvailableSlots = (date) => {
    axios.get(`http://localhost:5000/api/available-slots?date=${date}`)
      .then(response => setAvailableSlots(response.data))
      .catch(error => console.error('Error fetching available slots:', error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData);
      setBookings([...bookings, response.data]);
      setSummary(response.data);
      setMessage('Booking successful!');
      setFormData({ date: '', time: '', guests: '', name: '', contact: '' });
      setAvailableSlots([]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating booking.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch (error) {
      setMessage('Error deleting booking.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Restaurant Table Booking</h1>

        {message && (
          <div className="mb-4 text-center">
            <p className="text-red-500">{message}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Book Your Table</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold">Available Slots</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded-md"
                >
                  <option value="">Select a time</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold">Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="border w-full p-2 rounded-md"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Book Table
              </button>
            </div>
          </form>

          {/* Booking Summary */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            {summary ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Booking Summary</h2>
                <p><strong>Date:</strong> {summary.date}</p>
                <p><strong>Time:</strong> {summary.time}</p>
                <p><strong>Guests:</strong> {summary.guests}</p>
                <p><strong>Name:</strong> {summary.name}</p>
                <p><strong>Contact:</strong> {summary.contact}</p>
              </div>
            ) : (
              <p className="text-gray-500">Your booking summary will appear here after booking.</p>
            )}
          </div>
        </div>

        {/* Bookings List */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Existing Bookings</h2>
          <ul className="space-y-4">
            {bookings.map(booking => (
              <li key={booking.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
                <span>{`${booking.date} ${booking.time} - ${booking.name} (${booking.guests} guests)`}</span>
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
