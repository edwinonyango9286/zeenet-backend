const mongoose = require("mongoose");

var deliveryAddressSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Country is required."],
      unique: true,
      trim: true,
      minlength: [2, "Country must be at least 2 characters long"],
      maxlength: [32, "Country must be atmost 32 characters long."],
    },
    county: {
      type: String,
      required: [true, "County is required."],
      trim: true,
      unique: true,
      minlength: [2, "County must be at least 2 characters long"],
      maxlength: [32, "County must be atmost 32 characters long."],
    },
    town: {
      type: String,
      required: [true, "Town is required."],
      trim: true,
      unique: true,
      minlength: [2, "Town must be at least 2 characters long"],
      maxlength: [32, "Town must be atmost 32 characters long."],
    },
    station: {
      type: String,
      required: [true, "Station is required."],
      trim: true,
      unique: true,
      minlength: [2, "Station must be at least 2 characters long"],
      maxlength: [32, "Station must be atmost 32 characters long."],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to capitalize the first letter of each word in the specified fields
deliveryAddressSchema.pre("save", function (next) {
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  this.country = capitalizeWords(this.country);
  this.county = capitalizeWords(this.county);
  this.town = capitalizeWords(this.town);
  this.station = capitalizeWords(this.station);
  next();
});

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);
