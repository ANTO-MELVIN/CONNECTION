const busService = require('../services/bus.service');
const bookingService = require('../services/booking.service');

async function getOwnerBuses(req, res, next) {
  try {
    const { ownerId } = req.params;
    const buses = await busService.getOwnerBuses(ownerId);
    res.json(buses);
  } catch (error) {
    next(error);
  }
}

async function createBus(req, res, next) {
  try {
    const { ownerId } = req.params;
    const bus = await busService.createBus(ownerId, req.body);
    res.status(201).json(bus);
  } catch (error) {
    next(error);
  }
}

async function updateBus(req, res, next) {
  try {
    const { ownerId, busId } = req.params;
    const bus = await busService.updateBus(ownerId, busId, req.body);
    res.json(bus);
  } catch (error) {
    next(error);
  }
}

async function listOwnerBookings(req, res, next) {
  try {
    const { ownerId } = req.params;
    const bookings = await bookingService.listBookingsForOwner(ownerId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function updateExpectedPrice(req, res, next) {
  try {
    const { ownerId, busId } = req.params;
    const { expectedPrice, note } = req.body ?? {};
    const pricing = await busService.updateExpectedPrice(ownerId, busId, expectedPrice, note);
    res.json(pricing);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOwnerBuses,
  createBus,
  updateBus,
  listOwnerBookings,
  updateExpectedPrice,
};
