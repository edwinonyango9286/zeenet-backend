const Coupon = require("../models/couponModel");
const validateMongodbId = require("../utils/validateMongodbId");
const expressAsyncHandler = require("express-async-handler");

const createCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = expressAsyncHandler(async (req, res) => {
  try {
    const allcoupons = await Coupon.find();
    res.json(allcoupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deletedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getACoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const getacoupon = await Coupon.findById(id);
    res.json(getacoupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  updateCoupon,
  getAllCoupons,
  deleteCoupon,
  getACoupon,
};
