const mongoose = require("mongoose");

const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
      trim:true,
    },
    paymentDetails: {
      mpesaOrderId: {
        type: String,
        required: [true, "Mpesa order ID is required"],
        trim: true,
        minlength: [10, "Mpesa order ID must be at least 10 characters long"],
      },
      mpesaPaymentId: {
        type: String,
        required: [true, "Mpesa payment ID is required"],
        trim: true,
        minlength: [10, "Mpesa payment ID must be at least 10 characters long"],
      },
    },
    orderedItems: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
          trim:true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be a positive number"],
        },
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    month: {
      type: String,
      default: () => (new Date().getMonth() + 1).toString().padStart(2, "0"),
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price must be a positive number"],
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: [true, "Total price after discount is required"],
      min: [0, "Total price after discount must be a positive number"],
    },
    status: {
      type: String,
      default: "Ordered",
      required: [true, "Order status is required."],
      trim: true,
      enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
