const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorizeRoles('ADMIN'));
router.post('/owners/:ownerId/approve', adminController.approveOwner);
router.get('/summary', adminController.getSummary);

module.exports = router;
