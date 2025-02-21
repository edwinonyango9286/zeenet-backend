const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid object id.",
      },
    },

    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      index: true,
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
    },
    shortDescription: {
      type: String,
      required: [true, "Description is required."],
      minlength: [2, "Short description must be atleast 2 characters long."],
      maxlength: [500, "Short description must be atmost 500 characters long."],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [2000, "Description must be atmost 2000 characters long."],
      trim: true,
      index: true,
    },
    category: {
      type: ObjectId,
      required: [true, "Category is required."],
      ref: "BlogCategory",
      trim: true,
      validate: {
        validator: function (v) {
          return ObjectId.isValid(v);
        },
        message: "Invalid blog category ID.",
      },
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
        trim: true,
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid user ID.",
        },
      },
    ],
    dislikes: [
      {
        type: ObjectId,
        ref: "User",
        trim: true,
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid user ID.",
        },
      },
    ],
    author: {
      type: String,
      default: "admin",
      trim: true,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    pusblishedAt: {
      type: Date,
      default: Date.now(),
    },
    visibility: {
      type: String,
      enum: ["Hidden", "Published", "Scheduled"],
      default: "Published",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
