const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const expressAsyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controllers/emailCtrl");
const emailValidator = require("email-validator");
const validatePassword = require("../utils/validatePassword");

const createUser = expressAsyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  //Input validation
  if (!firstname || !lastname || !email || !mobile || !password) {
    throw new Error("Please fill in all the required fields.");
  }
  validatePassword(password);
  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(
      "An account with this email already exists. Login instead."
    );
  }
  const newUser = await User.create(req.body);
  res.json(newUser);
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Input validation
  if (!email || !password) {
    throw new Error("Please fill in all the required fields.");
  }
  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  validatePassword(password);
  const user = await User.findOne({ email });
  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE),
    });
    res.json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Wrong email or password.");
  }
});

const adminLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Input validation
  if (!email || !password) {
    throw new Error("Please fill in all the required fields.");
  }
  validatePassword(password);
  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  const user = await User.findOne({ email });
  if (!user || user.role !== "admin") {
    throw new Error("Not authorised.");
  }
  if (!(await user.isPasswordMatched(password))) {
    throw new Error("Wrong email or password.");
  }
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE),
  });
  res.json({
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    mobile: user.mobile,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

const handleRefreshToken = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token in cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("Refresh token does not matched.");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Something wrong with the refreshtoken...");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});

const logout = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) throw new Error("No refresh token in cookies.");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      sameSite: none,
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const updateAUser = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  const { firstname, lastname, email, mobile } = req.body;
  if (!firstname || !lastname || !email || !mobile) {
    throw new Error("Please fill in all the required fields.");
  }

  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
    },
    {
      new: true,
    }
  );
  res.json({
    updatedUser,
  });
});

const saveUserAddress = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  const { address } = req.body;
  if (!address) {
    throw new Error("Please provide an address.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { address: address },
    {
      new: true,
    }
  );
  res.json(updatedUser);
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
  const getUsers = await User.find();
  res.json(getUsers);
});

const getAUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found.");
  }
  res.json({
    user,
  });
});

const deleteAUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deletedUsers = await User.findByIdAndDelete(id);
  res.json({
    deletedUsers,
  });
});

const blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const blockedUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json({
    blockedUser,
    message: "User is blocked and can not make purchases.",
  });
});

const unBlockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const unblockedUser = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json({
    unblockedUser,
    message: "User has been unblocked and can now make purchases.",
  });
});

const updatePassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new Error("Please fill in all the required fields.");
  }
  validateMongodbId(_id);
  validatePassword(password);
  validatePassword(confirmPassword);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error("Please fill in all the required fields.");
  }
  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  const user = await User.findOne({ email });
  if (!user)
    throw new Error(
      "We're having a problem sending you an email. Please try again later."
    );
  const token = await user.createPasswordResetToken();
  await user.save();
  const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid 10 minutes from now. <a href='https://zeenet-frontstore.onrender.com/reset-password/${token}'>Click Here</>`;
  const data = {
    to: email,
    text: "Zeenet e-commerce.",
    subject: "Password reset link",
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
});

const forgotPasswordAdminToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error("Please fill in all the required fields.");
  }
  if (!emailValidator.validate(email)) {
    throw new Error("Please provide a valid email address.");
  }
  const user = await User.findOne({ email });
  if (!user)
    throw new Error(
      "We're having a problem sending you an email. Please try again later."
    );

  if (user.role !== "admin") {
    throw new Error(
      "We're having a problem sending you an email. Please try again later."
    );
  }
  const token = await user.createPasswordResetToken();
  await user.save();
  const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid 10 minutes from now. <a href='https://zeenet-adminapp.onrender.com/reset-password/${token}'>Click Here</>`;
  const data = {
    to: email,
    text: "Zeenet e-commerce.",
    subject: "Password reset link",
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
});

const resetPassword = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  validatePassword(password);
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Please initiate reset password process again.");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  const user = await User.findById(_id).populate("wishlist");
  res.json(user);
});

const adddProductToCart = expressAsyncHandler(async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  let newCart = await new Cart({
    userId: _id,
    productId,
    quantity,
    price,
  }).save();
  res.json(newCart);
});

const getUserCart = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  const cart = await Cart.find({ userId: _id }).populate("productId");
  res.json(cart);
});

const applyCoupon = expressAsyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

const createOrder = expressAsyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderedItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;

  if (
    !shippingInfo ||
    !orderedItems ||
    !totalPrice ||
    !totalPriceAfterDiscount ||
    !paymentInfo
  ) {
    throw new Error(
      "Please verify that you have provided all the order related information."
    );
  }

  const { _id } = req.user;
  validateMongodbId(_id);
  const order = await Order.create({
    shippingInfo,
    orderedItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
    user: _id,
  });
  res.json({
    order,
    success: true,
  });
});

const getMyOrders = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const orders = await Order.find({ user: _id })
    .populate("user")
    .populate("orderedItems.product");
  res.json({ orders });
});
const getAllOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json({ orders });
});

const getASingleOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const order = await Order.findOne({ _id: id }).populate(
    "orderedItems.product"
  );
  res.json({ order });
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const order = await Order.findById(id);
  const { status } = req.body;
  if (!status) {
    throw new Error("Select Order status.");
  }
  order.orderStatus = status;
  await order.save();
  res.json({ order });
});

const getMonthWiseOrderIncome = expressAsyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { month: "$month" },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

const getYearlyOrders = expressAsyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
      },
    },
  ]);
  res.json(data);
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  adminLogin,
  getWishlist,
  saveUserAddress,
  adddProductToCart,
  getUserCart,
  applyCoupon,
  createOrder,
  getMyOrders,
  getMonthWiseOrderIncome,
  getYearlyOrders,
  getAllOrders,
  getASingleOrder,
  updateOrderStatus,
  forgotPasswordAdminToken,
};
