const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    addedBy: {
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
    name: {
      type: String,
      required: [true, "Title is required."],
      unique: true,
      index: true,
      trim: true,
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
    },
    shortDescription: {
      type: String,
      required: true,
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [500, "Name must be atmost 500 characters long."],
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
  },
  {
    timestamps: true,
  }
);

blogCategorySchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
