const adminService = require('../services/admin.service');

async function approveOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const owner = await adminService.approveOwner(ownerId, req.user.id);
    res.json(owner);
  } catch (error) {
    next(error);
  }
}

async function getSummary(req, res, next) {
  try {
    const summary = await adminService.getDashboardSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

async function listPendingBuses(req, res, next) {
  try {
    const buses = await adminService.listPendingBuses();
    res.json(buses);
  } catch (error) {
    next(error);
  }
}

async function approveBus(req, res, next) {
  try {
    const { busId } = req.params;
    const { note } = req.body ?? {};
    const bus = await adminService.approveBus(busId, req.user.id, note);
    res.json(bus);
  } catch (error) {
    next(error);
  }
}

async function rejectBus(req, res, next) {
  try {
    const { busId } = req.params;
    const { note } = req.body ?? {};
    const bus = await adminService.rejectBus(busId, req.user.id, note);
    res.json(bus);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  approveOwner,
  getSummary,
  listPendingBuses,
  approveBus,
  rejectBus,
};
