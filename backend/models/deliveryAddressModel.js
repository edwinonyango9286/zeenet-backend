const mongoose = require("mongoose");

const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

var deliveryAddressSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: [true, "User is required."],
      ref: "User",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Country ID.",
      },
    },
    country: {
      type: ObjectId,
      required: [true, "Country is required."],
      ref: "Country",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Country ID.",
      },
    },
    county: {
      type: ObjectId,
      required: [true, "County is required."],
      ref: "County",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid County ID.",
      },
    },
    town: {
      type: ObjectId,
      required: [true, "Town is required."],
      ref: "Town",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Town ID.",
      },
    },
    deliveryStation: {
      type: ObjectId,
      required: [true, "Delivery Station is required."],
      ref: "DeliveryStation",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Delivery Station ID.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);
