const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorizeRoles('ADMIN'));
router.post('/owners/:ownerId/approve', adminController.approveOwner);
router.get('/summary', adminController.getSummary);
router.get('/buses/pending', adminController.listPendingBuses);
router.post('/buses/:busId/approve', adminController.approveBus);
router.post('/buses/:busId/reject', adminController.rejectBus);
router.get('/quotes', adminController.listQuoteRequests);
router.patch('/quotes/:bookingId', adminController.updateQuoteNegotiation);
router.post('/quotes/:bookingId/lock-owner', adminController.lockOwnerPayout);
router.post('/quotes/:bookingId/lock-user', adminController.lockUserPrice);

module.exports = router;
