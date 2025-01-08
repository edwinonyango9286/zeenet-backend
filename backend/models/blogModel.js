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
      maxlength: [32, "Title must be atmost 32 characters long."],
      match: [
        /^[a-zA-Z0-9\s]+$/,
        "Title can only contain alphanumeric characters and spaces.",
      ],
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
      },
    ],
    dislikes: [
      {
        type: ObjectId,
        ref: "User",
        trim: true,
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

blogSchema.pre("save", function (next) {
  this.title = this.title.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
