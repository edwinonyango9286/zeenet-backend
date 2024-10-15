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
    },
    shippingInfo: {
      firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 2,
        maxlength: 32,
        trim: true,
      },
      county: {
        type: String,
        required: true,
        trim: true,
      },
      town: {
        type: String,
        required: true,
        trim: true,
      },
      pickupStation: {
        type: String,
        required: true,
        trim: true,
      },
    },
    paymentInfo: {
      mpesaOrderId: {
        type: String,
        required: true,
        trim: true,
      },
      mpesaPaymentId: {
        type: String,
        required: true,
        trim: true,
      },
    },
    orderedItems: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          trim: true,
        },
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    month: {
      type: String,
      default: new Date().getMonth(),
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPriceAfterDiscount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "Ordered",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
