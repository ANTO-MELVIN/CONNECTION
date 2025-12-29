const express = require('express');
const busController = require('../controllers/bus.controller');

const router = express.Router();

router.get('/', busController.listBuses);
router.get('/:busId/schedules', busController.listSchedules);

module.exports = router;
