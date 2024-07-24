const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

var cartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    productId: {
      type: ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: ObjectId,
      ref: "Color",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
