const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const DeliveryStation = require("../models/deliveryStationModel");

const createDeliveryStation = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields");
    }
    const newDeliveryStation = await DeliveryStation.create(req.body);
    res.status(201).json(newDeliveryStation);
  } catch (error) {
    throw new Error(error);
  }
});

const updateDeliveryStation = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedDeliveryStation = await DeliveryStation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedDeliveryStation) {
      throw new Error("Delivery station not found.");
    }
    res.status(200).json(updatedDeliveryStation);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteDeliveryStation = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedDeliveryStation = await DeliveryStation.findByIdAndDelete(id);
    if (!deletedDeliveryStation) {
      throw new Error("Delivery station not found.");
    }
    res.status(200).json(deletedDeliveryStation);
  } catch (error) {
    throw new Error(error);
  }
});

const getDeliveryStation = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deliveryStation = await DeliveryStation.findById(id);
    if (!deliveryStation) {
      throw new Error("Delivery station not found.");
    }
    res.status(200).json(deliveryStation);
  } catch (error) {
    throw new Error(error);
  }
});

const getallDeliveryStations = expressAsyncHandler(async (req, res) => {
  try {
    const deliveryStations = await DeliveryStation.find();
    res.status(200).json(deliveryStations);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createDeliveryStation,
  updateDeliveryStation,
  deleteDeliveryStation,
  getDeliveryStation,
  getallDeliveryStations,
};
