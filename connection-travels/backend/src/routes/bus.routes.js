const express = require('express');
const busController = require('../controllers/bus.controller');

const router = express.Router();

router.get('/', busController.listBuses);

module.exports = router;
