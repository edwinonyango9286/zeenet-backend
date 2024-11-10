const mongoose = require("mongoose");
const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 2000,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 16,
      trim: true,
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
      },
    ],
    dislikes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: String,
      default: "admin",
      trim: true,
    },
    images: {
      type: [String],
      required: true,
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

module.exports = mongoose.model("Blog", blogSchema);
