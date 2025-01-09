const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enquiry Name is required."],
    trim: true,
    minlength: [2, "Enquiry name  must be atleast 2 characters long."],
    maxlength: [32, "Enquiry name must be atmost 32 characters long."],
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    lowercase: true,
    minlength: [2, "Email must be atleast 2 characters long."],
    maxlength: [32, "Email must be atmost 32 characters long."],
    trim: true,
    match: [/.+\@.+\..+/, "Please provide a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone Number is required."],
    trim: true,
    match: [/^\+?[0-9]\d{1,14}$/, "Please provide a valid phone number."],
  },
  enquiry: {
    type: String,
    required: true,
    minlength: [2, "Enquiry must be atleast 2 characters long."],
    maxlength: [500, "Enquiry must be atmost 500 characters long."],
    trim: true,
  },
  status: {
    type: String,
    default: "Submitted",
    enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
  },
});

module.exports = mongoose.model("Enquiry", enquirySchema);
