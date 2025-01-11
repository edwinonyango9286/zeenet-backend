const mongoose = require("mongoose");

const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

var deliveryAddressSchema = new mongoose.Schema(
  {
    country: {
      type: ObjectId,
      required: [true, "Country is required."],
      ref: "Country",
      unique: true,
      trim: true,
    },
    county: {
      type: ObjectId,
      required: [true, "County is required."],
      trim: true,
      ref: "County",
      unique: true,
    },
    town: {
      type: ObjectId,
      required: [true, "Town is required."],
      ref: "Town",
      trim: true,
      unique: true,
    },
    deliveryStation: {
      type: ObjectId,
      required: [true, "Station is required."],
      ref: "DeliveryStation",
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);
