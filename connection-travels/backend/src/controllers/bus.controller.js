const busService = require('../services/bus.service');

async function listBuses(req, res, next) {
  try {
    const buses = await busService.listActiveBuses();
    res.json(buses);
  } catch (error) {
    next(error);
  }
}

async function listSchedules(req, res, next) {
  try {
    const { busId } = req.params;
    const schedules = await busService.getBusSchedules(busId);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listBuses,
  listSchedules,
};
