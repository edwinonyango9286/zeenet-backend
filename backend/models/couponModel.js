const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Coupon is required."],
    unique: true,
    uppercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9\s]+$/,
      "Coupon can only contain alphanumeric characters and spaces.",
    ],
  },
  expiry: {
    type: Date,
    required: [true, "Coupon expiry date is required."],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: "Expiry date must be in the future.",
    },
  },
  discount: {
    type: Number,
    required: [true, "Percentage discount is required."],
    min: [0, "Discount must be at least 0%."],
    max: [100, "Discount cannot exceed 100%."],
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
