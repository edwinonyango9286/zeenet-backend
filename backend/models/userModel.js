const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {
  Types: { ObjectId },
} = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minlength: [2, "First name must be atleast 2 characters long."],
      maxlength: [72, "Last name must be atmost 72 characters long."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      minlength: [2, "Last name must be at least 2 characters long."],
      maxlength: [72, "Last name must be at most 72 characters long."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      minlength: [2, "Email must be at least 2 characters long."],
      maxlength: [72, "Email must be at most 72 characters long."],
      trim: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      maxlength: [15, "Phone number must not exceed 15 characters."],
      unique: true,
      trim: true,
      match: [/^\+?[0-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    avatar: {
      type: String,
      default:
        "https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png",
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // contains products
    cart: [
      {
        type: ObjectId,
        ref: "Product",
        default: [],
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid delivery address ID.",
        },
      },
    ],

    type: Array,
    default: [],
    orders: [
      {
        type: ObjectId,
        ref: "Order",
        default: [],
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid delivery address ID.",
        },
      },
    ],
    deliveryAddress: [
      {
        type: ObjectId,
        ref: "DeliveryAddress",
        default: [],
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid delivery address ID.",
        },
      },
    ],
    wishlist: [
      {
        type: ObjectId,
        ref: "Product",
        default: [],
        validate: {
          validator: function (v) {
            return ObjectId.isValid(v);
          },
          message: "Invalid product ID.",
        },
      },
    ],
    refreshToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    userType: {
      type: String,
      enum: ["Wholesaler", "Default"],
      default: "Default",
    },
  },

  { timestamps: true }
);

// pre-save hook to hash the password before saving it.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if the entered password matches the hashed password.
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a password reset token.
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
