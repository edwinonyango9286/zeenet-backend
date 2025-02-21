const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    addedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user id",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [100, "Description must be at most 100 characters long"],
    },
    description: {
      type: String,
      required: true,
      minlength: [2, "Title must be at least 2 characters long."],
      maxlength: [72, "Description must be at most 72 characters long"],
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

// converts the first letter of the name to uppercase
colorSchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Color", colorSchema);
