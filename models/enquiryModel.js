const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    sentBy: {
      type: String,
      required: [true, "Enquiry Name is required."],
      trim: true,
      minlength: [2, "Enquiry name  must be atleast 2 characters long."],
      maxlength: [72, "Enquiry name must be atmost 72 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      lowercase: true,
      minlength: [2, "Email must be atleast 2 characters long."],
      maxlength: [72, "Email must be atmost 72 characters long."],
      trim: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required."],
      trim: true,
      maxlength: [15, "Phone number must not exceed 15 characters."],
      match: [/^\+?[0-9]\d{1,14}$/, "Please provide a valid phone number."],
    },
    enquiryBody: {
      type: String,
      required: true,
      minlength: [2, "Enquiry must be atleast 2 characters long."],
      maxlength: [2000, "Enquiry must be atmost 500 characters long."],
      trim: true,
    },
    status: {
      type: String,
      default: "Submitted",
      enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
