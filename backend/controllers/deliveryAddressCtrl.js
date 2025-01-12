const expressAsyncHandler = require("express-async-handler");
const DeliveryAddress = require("../models/deliveryAddressModel");
const validateMongodbId = require("../utils/validateMongodbId");

const createDeliveryAddress = expressAsyncHandler(async (req, res) => {
  try {
    const { user, country, county, town, deliveryStation } = req.body;
    if (!user || !country || !county || !town || !deliveryStation) {
      throw new Error("Please provide all the required fields.");
    }
    const createdDeliveryAddress = await DeliveryAddress.create(req.body);
    res.status(201).json(createdDeliveryAddress);
  } catch (error) {
    throw new Error(error);
  }
});


const getDeliveryAddress = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryAddress = await DeliveryAddress.findById({ id });
    if (!deliveryAddress) {
      throw new Error("Delivery address not found.");
    }
    res.status(200).json(deliveryAddress);
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

const deleteDeliveryAddress = expressAsyncHandler(async () => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedDeliveryAddress = await DeliveryAddress.findByIdAndDelete(id);
    if (!deletedDeliveryAddress) {
      throw new Error("Delivery address not found.");
    }
    res.status(200).json(deletedDeliveryAddress);
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
  createDeliveryAddress,
  getDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddresses,
};
