const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",   
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    default: 1
  },
  notes: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
