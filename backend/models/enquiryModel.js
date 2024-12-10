const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 64,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 2,
    maxlength: 32,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  enquiry: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
    trim: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
