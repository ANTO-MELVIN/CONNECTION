const prisma = require('../lib/prisma');
const { emitToOwners } = require('../lib/socket');

async function approveOwner(ownerId, approvedByUserId) {
  const owner = await prisma.ownerProfile.update({
    where: { id: ownerId },
    data: { verifiedByAdmin: true },
    include: { user: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: approvedByUserId,
      action: 'OWNER_APPROVED',
      entity: 'OwnerProfile',
      entityId: ownerId,
      payload: { ownerId },
    },
  });

  emitToOwners(ownerId, 'owner:approved', owner);

  return owner;
}

async function getDashboardSummary() {
  const [owners, users, buses, bookings] = await Promise.all([
    prisma.ownerProfile.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.bus.count(),
    prisma.booking.count(),
  ]);

  return {
    owners,
    users,
    buses,
    bookings,
  };
}

module.exports = {
  approveOwner,
  getDashboardSummary,
};
