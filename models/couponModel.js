const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon is required."],
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
      unique: true,
      uppercase: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
