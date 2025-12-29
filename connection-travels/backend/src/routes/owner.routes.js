const express = require('express');
const ownerController = require('../controllers/owner.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(authenticate, authorizeRoles('OWNER', 'ADMIN'));
router.get('/:ownerId/buses', ownerController.getOwnerBuses);
router.post('/:ownerId/buses', ownerController.createBus);
router.patch('/:ownerId/buses/:busId', ownerController.updateBus);
router.put('/:ownerId/buses/:busId/schedules', ownerController.upsertSchedule);
router.get('/:ownerId/bookings', ownerController.listOwnerBookings);

module.exports = router;
