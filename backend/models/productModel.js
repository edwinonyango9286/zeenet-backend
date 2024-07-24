const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 2000,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    screensize: {
      type: Number,
      required: true,
      trim:true,
    },
    
    tags: {
      type: String,
      trim: true,
    },

    ratings: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    totalrating: {
      type: String,
      default: 4,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
