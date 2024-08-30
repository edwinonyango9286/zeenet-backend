const Coupon = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");
const expressAsyncHandler = require("express-async-handler");

const createCoupon = expressAsyncHandler(async (req, res) => {
  const newCoupon = await Coupon.create(req.body);
  res.json(newCoupon);
});

const getAllCoupons = expressAsyncHandler(async (req, res) => {
  const allcoupons = await Coupon.find();
  res.json(allcoupons);
});

const updateCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedCoupon);
});

const deleteCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const deletedCoupon = await Coupon.findByIdAndDelete(id);
  res.json(deletedCoupon);
});

const getACoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getacoupon = await Coupon.findById(id);
  res.json(getacoupon);
});

module.exports = {
  createCoupon,
  updateCoupon,
  getAllCoupons,
  deleteCoupon,
  getACoupon,
};
