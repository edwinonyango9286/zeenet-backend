const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      unique: true,
      index: true,
      trim: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [32, "Title must be atmost 32 characters long."],
      match: [
        /^[a-zA-Z0-9\s]+$/,
        "Title can only contain alphanumeric characters and spaces",
      ],
    },
  },
  {
    timestamps: true,
  }
);

blogCategorySchema.pre("save", function (next) {
  this.title = this.title.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
