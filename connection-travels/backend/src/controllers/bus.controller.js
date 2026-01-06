const busService = require('../services/bus.service');

async function listBuses(req, res, next) {
  try {
    const buses = await busService.listActiveBuses();
    res.json(buses);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBuses,
};
