const prisma = require('../lib/prisma');
const bookingService = require('./booking.service');
const { emitToOwners, emitToAdmins, emitToUsers } = require('../lib/socket');

function formatMedia(media) {
  if (!media) {
    return media;
  }
  return {
    id: media.id,
    busId: media.busId,
    fileName: media.fileName,
    mimeType: media.mimeType,
    kind: media.kind,
    url: media.url,
    data: media.data ? media.data.toString('base64') : null,
    createdAt: media.createdAt,
    updatedAt: media.updatedAt,
  };
}

function formatBus(bus) {
  if (!bus) {
    return bus;
  }
  return {
    ...bus,
    media: Array.isArray(bus.media) ? bus.media.map(formatMedia) : [],
    pricing: bus.pricing ?? null,
  };
}

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

async function listPendingBuses() {
  const buses = await prisma.bus.findMany({
    where: { approvalStatus: 'PENDING' },
    include: {
      owner: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      media: true,
      pricing: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return buses.map(formatBus);
}

async function approveBus(busId, approvedByUserId, note) {
  const bus = await prisma.bus.update({
    where: { id: busId },
    data: {
      approvalStatus: 'APPROVED',
      approvalNote: note ?? null,
      active: true,
    },
    include: {
      owner: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      media: true,
      pricing: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: approvedByUserId,
      action: 'BUS_APPROVED',
      entity: 'Bus',
      entityId: busId,
      payload: { busId, note: note ?? null },
    },
  });

  const formattedBus = formatBus(bus);

  emitToOwners(bus.ownerId, 'bus:approved', formattedBus);
  emitToAdmins('bus:approved', formattedBus);
  emitToUsers('bus:created', formattedBus);

  return formattedBus;
}

async function rejectBus(busId, rejectedByUserId, note) {
  const bus = await prisma.bus.update({
    where: { id: busId },
    data: {
      approvalStatus: 'REJECTED',
      approvalNote: note ?? null,
      active: false,
    },
    include: {
      owner: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      media: true,
      pricing: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: rejectedByUserId,
      action: 'BUS_REJECTED',
      entity: 'Bus',
      entityId: busId,
      payload: { busId, note: note ?? null },
    },
  });

  const formattedBus = formatBus(bus);

  emitToOwners(bus.ownerId, 'bus:rejected', formattedBus);
  emitToAdmins('bus:rejected', formattedBus);
  emitToUsers('bus:removed', { id: bus.id });

  return formattedBus;
}

async function listQuoteRequests() {
  return bookingService.listQuoteRequests();
}

async function updateQuoteNegotiation(bookingId, adminId, payload) {
  return bookingService.adminUpdateNegotiation(bookingId, adminId, payload);
}

async function lockOwnerPayout(bookingId, adminId, ownerPayoutPrice) {
  return bookingService.lockOwnerPayout(bookingId, adminId, ownerPayoutPrice);
}

async function lockUserPrice(bookingId, adminId, userFinalPrice) {
  return bookingService.lockUserPrice(bookingId, adminId, userFinalPrice);
}

module.exports = {
  approveOwner,
  getDashboardSummary,
  listPendingBuses,
  approveBus,
  rejectBus,
  listQuoteRequests,
  updateQuoteNegotiation,
  lockOwnerPayout,
  lockUserPrice,
};
