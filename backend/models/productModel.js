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
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    screenSize: {
      type: Number,
      trim: true,
    },

    tags: {
      type: String,
      required: true,
      trim: true,
      enum: ["Featured", "Popular", "Special"],
    },

    ratings: [
      {
        star: {
          type: Number,
          required: function () {
            return this.ratings && this.ratings.length > 0;
          },
        },
        comment: {
          type: String,
          required: function () {
            return this.ratings && this.ratings.length > 0;
          },
        },
        postedBy: {
          type: ObjectId,
          ref: "User",
          required: function () {
            return this.ratings && this.ratings.length > 0;
          },
        },
      },
    ],

    totalRating: {
      type: String,
      default: 4,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
