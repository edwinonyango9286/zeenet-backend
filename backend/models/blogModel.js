const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      index: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [50, "Title must be atmost 50 characters long."],
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
        message: "Invalid Country ID.",
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
          message: "Invalid Country ID.",
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
          message: "Invalid Country ID.",
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
  this.title = this.title.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
