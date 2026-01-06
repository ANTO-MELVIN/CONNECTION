const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorizeRoles('CUSTOMER'));
router.post('/', bookingController.createBooking);
router.get('/', bookingController.listUserBookings);
router.get('/:bookingId', bookingController.getUserBooking);

module.exports = router;
