const expressAsyncHandler = require("express-async-handler");
const DeliveryAddress = require("../models/deliveryAddressModel");
const validateMongodbId = require("../utils/validateMongodbId");
const User = require("../models/userModel");

const addDeliveryAddress = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    validateMongodbId(userId);
    const { country, county, town, deliveryStation } = req.body;
    if (!country || !county || !town || !deliveryStation) {
      throw new Error("Please provide all the required fields.");
    }
    const newDeliveryAddress = await DeliveryAddress.create({
      user: userId,
      country,
      county,
      town,
      deliveryStation,
    });
    // Push the new address's ObjectId into the user's deliveryAddress array
    await User.findByIdAndUpdate(
      userId,
      { $push: { deliveryAddress: newDeliveryAddress._id } },
      { new: true }
    );
    res.status(201).json({
      message: "Delivery address added successfully.",
      address: newDeliveryAddress,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserDeliveryAddresses = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    validateMongodbId(userId);

    const user = await User.findById(userId).populate({
      path: "deliveryAddress",
      populate: [
        { path: "country", select: "name" },
        { path: "county", select: "name" },
        { path: "town", select: "name" },
        { path: "deliveryStation", select: "name" },
      ],
    });
    if (!user) {
      throw new Error("User not found.");
    }
    res.status(200).json(user.deliveryAddress);
  } catch (error) {
    throw new Error(error);
  }
});

const updateDeliveryAddress = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const { country, county, town, deliveryStation } = req.body;
    if (!country || !county || !town || !deliveryStation) {
      throw new Error("Please provide all the required fields.");
    }
    const updatedDeliveryAddress = await DeliveryAddress.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedDeliveryAddress) {
      throw new Error("Delivery address not found.");
    }
    res.status(200).json(updatedDeliveryAddress);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteDeliveryAddress = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    validateMongodbId(id);
    validateMongodbId(userId);
    const deletedDeliveryAddress = await DeliveryAddress.findByIdAndDelete(id);
    if (!deletedDeliveryAddress) {
      throw new Error("Delivery address not found.");
    }
    await User.findByIdAndUpdate(
      userId,
      { $pull: { deliveryAddress: id } },
      { new: true }
    );
    res.status(200).json({
      message: "Delivery address removed successfully.",
      deletedDeliveryAddress,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllDeliveryAddresses = expressAsyncHandler(async (req, res) => {
  try {
    const deliveryAddresses = await DeliveryAddress.find();
    res.status(200).json(deliveryAddresses);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addDeliveryAddress,
  getUserDeliveryAddresses,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddresses,
};
