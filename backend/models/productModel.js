const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [32, "Title must be atmost 32 characters long."],
      index: true,
      match: [
        /^[a-zA-Z0-9\s]+$/,
        "Title can only contain alphanumeric characters and spaces.",
      ],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [2000, "Description must be atmost 2000 characters long."],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
    category: {
      type: ObjectId,
      required: [true, "Category is required."],
      ref: "ProductCategory",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Country ID.",
      },
    },
    brand: {
      type: ObjectId,
      required: [true, "Brand is required."],
      ref: "Brand",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid Country ID.",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quanity is required."],
      min: [0, "Quantity must be a positive number."],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold quantity cannot be negative."],
    },

    screenSize: {
      type: Number,
      trim: true,
      min: [0, "Screen size can not be negative."],
    },
    images: {
      type: [
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
      // validation to ensure that the array has at least one image
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one image is required.",
      },
    },

    tags: {
      type: String,
      required: [true, "Tags is required."],
      trim: true,
      enum: ["Featured", "Popular", "Special"],
      index: true,
    },

    ratings: [
      {
        star: {
          type: Number,
          required: function () {
            return this.ratings && this.ratings.length > 0;
          },
        },
        ratingComment: {
          type: String,
          required: function () {
            return this.ratings && this.ratings.length > 0;
          },
        },
        postedBy: {
          type: ObjectId,
          ref: "User",
          trim: true,
          validate: {
            validator: function (v) {
              return ObjectId.isValid(v);
            },
            message: "Invalid Country ID.",
          },
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

productSchema.pre("save", function (next) {
  this.title = this.title.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Product", productSchema);
