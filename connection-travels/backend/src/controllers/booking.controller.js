const bookingService = require('../services/booking.service');

async function createBooking(req, res, next) {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

async function listUserBookings(req, res, next) {
  try {
    const bookings = await bookingService.listBookingsForUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function getUserBooking(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingForUser(req.user.id, bookingId);
    res.json(booking);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  listUserBookings,
  getUserBooking,
};
