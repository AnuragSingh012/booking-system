const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const bookings = [];

const getAvailableSlots = (date) => {
  const allSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const bookedSlots = bookings
    .filter((booking) => booking.date === date)
    .map((booking) => booking.time);

  return allSlots.filter((slot) => !bookedSlots.includes(slot));
};

// Create booking
app.post("/api/bookings", (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  // Validate input
  if (!date || !time || !guests || !name || !contact) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (isNaN(guests) || guests <= 0) {
    return res
      .status(400)
      .json({ message: "Guests must be a positive number." });
  }

  // Check for double booking
  const existingBooking = bookings.find(
    (booking) => booking.date === date && booking.time === time
  );

  if (existingBooking) {
    return res.status(400).json({ message: "This slot is already booked." });
  }

  // Add new booking
  const newBooking = {
    id: uuidv4(),
    date,
    time,
    guests,
    name,
    contact,
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Get available slots for a specific date
app.get("/api/available-slots", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required." });
  }

  const availableSlots = getAvailableSlots(date);
  res.json(availableSlots);
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found." });
  }

  bookings.splice(bookingIndex, 1);
  res.status(200).json({ message: "Booking deleted successfully." });
});

// Get server

app.get("/", (req, res) => {
  res.send("App is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
