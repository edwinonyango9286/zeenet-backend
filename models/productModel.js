const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    addedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user Id.",
      },
    },
    productCode: {
      type: String,
      required: [true, "Product code is required."],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [100, "Description must be at most 100 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minlength: [2, "Description must be at least 2 characters long."],
      maxlength: [2000, "Description must be at most 2000 characters long."],
      trim: true,
    },
    shortDescription: {
      type: String,
      requiredL: [true, "Product short description is required."],
      minlength: [2, "Description must be at least 2 characters long."],
      maxlength: [500, "Description must be at most 500 characters long."],
      trim: true,
    },
    currentPrice: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
    oldPrice: {
      type: Number,
      min: [0, "Price must be a positive number."],
    },
    category: {
      type: ObjectId,
      required: [true, "Category is required."],
      ref: "ProductCategory",
      trim: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid category ID.",
      },
    },
    brand: {
      type: ObjectId,
      required: [true, "Brand is required."],
      ref: "Brand",
      trim: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid brand ID.",
      },
    },
    quantityInStock: {
      type: Number,
      required: [true, "Quantity is required."],
      min: [0, "Quantity must be a positive number."],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold quantity cannot be negative."],
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
      validate: {
        validator: (v) => {
          return v.length > 0;
        },
        message: "At least one image is required.",
      },
    },
    tags: {
      type: String,
      required: [true, "Tags are required."],
      trim: true,
      enum: ["Featured", "Popular", "Special"],
    },
    color: {
      type: ObjectId,
      ref: "Color",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
      },
    },
    ratings: [
      {
        star: {
          type: Number,
          required: [true, "Please provide star rating for the product."],
        },
        ratingComment: {
          type: String,
          required: [true, "Please provide rating comment for the product."],
          trim: true,
        },
        postedBy: {
          type: ObjectId,
          ref: "User",
          trim: true,
          required: [true, "Please login to proceed."],
          validate: {
            validator: (id) => {
              return ObjectId.isValid(id);
            },
            message: "Invalid user ID.",
          },
        },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    visibility: {
      type: String,
      enum: ["Published", "Scheduled", "Hidden"],
      default: "Published",
    },
    publishedDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Product", productSchema);
