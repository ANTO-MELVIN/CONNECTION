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

async function listQuoteRequests(req, res, next) {
  try {
    const quotes = await adminService.listQuoteRequests();
    res.json(quotes);
  } catch (error) {
    next(error);
  }
}

async function updateQuoteNegotiation(req, res, next) {
  try {
    const { bookingId } = req.params;
    const updated = await adminService.updateQuoteNegotiation(bookingId, req.user.id, req.body ?? {});
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function lockOwnerPayout(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { ownerPayoutPrice } = req.body ?? {};
    if (ownerPayoutPrice == null) {
      const err = new Error('ownerPayoutPrice required');
      err.status = 400;
      throw err;
    }
    const updated = await adminService.lockOwnerPayout(bookingId, req.user.id, ownerPayoutPrice);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function lockUserPrice(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { userFinalPrice } = req.body ?? {};
    if (userFinalPrice == null) {
      const err = new Error('userFinalPrice required');
      err.status = 400;
      throw err;
    }
    const updated = await adminService.lockUserPrice(bookingId, req.user.id, userFinalPrice);
    res.json(updated);
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
  listQuoteRequests,
  updateQuoteNegotiation,
  lockOwnerPayout,
  lockUserPrice,
};
