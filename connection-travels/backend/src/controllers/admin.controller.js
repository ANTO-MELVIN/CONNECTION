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

module.exports = {
  approveOwner,
  getSummary,
};
