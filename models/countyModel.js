const mongoose = require("mongoose");

const countySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true,
      trim: true,
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
      match: [
        /^[a-zA-Z0-9\s]+$/,
        "Name can only contain alphanumeric characters and spaces.",
      ],
    },
  },
  { timestamps: true }
);

countySchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

// Pre-update hook for updating county
countySchema.pre("findOneAndUpdate", function (next) {
  if (this._update.name) {
    this._update.name = this._update.name.replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
  }
  next();

  // Pre-update hook for updating multiple county
  countySchema.pre("updateMany", function (next) {
    if (this._update.name) {
      this._update.name = this._update.name.replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
    }
    next();
  });
});

module.exports = mongoose.model("County", countySchema);
