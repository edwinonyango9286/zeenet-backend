const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: [true, "user Id is required."],
    },
    productId: {
      type: ObjectId,
      ref: "Product",
      required: [true, "Product Id is required."],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required."],
      min: [0, "Quantity must be a positive number."],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number."],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
