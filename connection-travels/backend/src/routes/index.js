const express = require('express');
const authRoutes = require('./auth.routes');
const ownerRoutes = require('./owner.routes');
const busRoutes = require('./bus.routes');
const bookingRoutes = require('./booking.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/owners', ownerRoutes);
router.use('/buses', busRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
