const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user id.",
      },
    },

    updatedBy: {
      type: ObjectId,
      ref: "User",
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user id.",
      },
    },

    name: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
    },
    shortDescription: {
      type: String,
      required: true,
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [2000, "Name must be atmost 500 characters long."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: ObjectId,
      ref: "User",
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user id.",
      },
    },
    visibility: {
      type: String,
      enum: ["Published", "Scheduled", "Hidden"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
