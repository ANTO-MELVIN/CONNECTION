const prisma = require('../lib/prisma');
const { emitToAdmins, emitToOwners, emitToUsers } = require('../lib/socket');

function buildTravelDetails(payload = {}) {
  const {
    pickupLocation,
    dropLocations,
    startDate,
    endDate,
    numberOfDays,
    passengers,
    budgetRange,
    eventType,
    specialInstructions,
    travelDetails,
  } = payload;

  const source = travelDetails && typeof travelDetails === 'object' ? travelDetails : {};

  return {
    pickupLocation: pickupLocation ?? source.pickupLocation ?? null,
    dropLocations: Array.isArray(dropLocations)
      ? dropLocations
      : Array.isArray(source.dropLocations)
        ? source.dropLocations
        : [],
    startDate: startDate ?? source.startDate ?? null,
    endDate: endDate ?? source.endDate ?? null,
    numberOfDays: numberOfDays ?? source.numberOfDays ?? null,
    passengers: passengers ?? source.passengers ?? null,
    budgetRange: budgetRange ?? source.budgetRange ?? null,
    eventType: eventType ?? source.eventType ?? null,
    specialInstructions: specialInstructions ?? source.specialInstructions ?? null,
  };
}

function buildPackageSelections(payload = {}) {
  if (Array.isArray(payload.packages)) {
    return payload.packages;
  }
  if (Array.isArray(payload.packageSelections)) {
    return payload.packageSelections;
  }
  if (payload.packages && typeof payload.packages === 'object') {
    return payload.packages;
  }
  return [];
}

async function createBooking(userId, payload) {
  const { busId } = payload;
  if (!busId) {
    const error = new Error('Bus selection required');
    error.status = 400;
    throw error;
  }

  const bus = await prisma.bus.findFirst({
    where: { id: busId, active: true, approvalStatus: 'APPROVED' },
    include: { owner: true, pricing: true },
  });

  if (!bus) {
    const error = new Error('Bus unavailable for booking');
    error.status = 404;
    throw error;
  }

  const travelDetails = buildTravelDetails(payload);

  if (!travelDetails.pickupLocation || !travelDetails.startDate || !travelDetails.passengers) {
    const error = new Error('Incomplete travel details');
    error.status = 400;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      busId,
      ownerId: bus.ownerId,
      status: 'QUOTE_REQUESTED',
      travelDetails,
      packageSelections: buildPackageSelections(payload),
      userNotes: payload.notes ?? payload.userNotes ?? null,
      adminNotes: null,
    },
    include: {
      bus: { include: { media: true } },
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
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  emitToAdmins('booking:quote-requested', booking);
  emitToOwners(booking.ownerId, 'booking:quote-requested', booking);

  return booking;
}

async function listBookingsForOwner(ownerId) {
  return prisma.booking.findMany({
    where: { ownerId },
    select: {
      id: true,
      status: true,
      ownerPayoutPrice: true,
      ownerPayoutLockedAt: true,
      travelDetails: true,
      packageSelections: true,
      adminNotes: true,
      ownerConfirmationAt: true,
      createdAt: true,
      updatedAt: true,
      bus: {
        select: {
          id: true,
          title: true,
          capacity: true,
          amenities: true,
          media: true,
          pricing: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function listBookingsForUser(userId) {
  return prisma.booking.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      userFinalPrice: true,
      userPriceLockedAt: true,
      travelDetails: true,
      packageSelections: true,
      adminNotes: true,
      userNotes: true,
      createdAt: true,
      updatedAt: true,
      bus: {
        select: {
          id: true,
          title: true,
          capacity: true,
          amenities: true,
          media: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getBookingForUser(userId, bookingId) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    select: {
      id: true,
      status: true,
      userFinalPrice: true,
      userPriceLockedAt: true,
      travelDetails: true,
      packageSelections: true,
      adminNotes: true,
      userNotes: true,
      ownerConfirmationAt: true,
      userConfirmationAt: true,
      createdAt: true,
      updatedAt: true,
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          reference: true,
          processedAt: true,
        },
      },
      bus: {
        select: {
          id: true,
          title: true,
          capacity: true,
          amenities: true,
          media: true,
        },
      },
    },
  });

  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  return booking;
}

async function listQuoteRequests() {
  return prisma.booking.findMany({
    where: { status: { in: ['QUOTE_REQUESTED', 'ADMIN_REVIEWING', 'PRICE_FINALIZED', 'AWAITING_PAYMENT'] } },
    include: {
      bus: {
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
          pricing: true,
        },
      },
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
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function adminUpdateNegotiation(bookingId, adminId, payload) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  const data = {};

  if ('status' in payload) {
    const allowedStatuses = ['QUOTE_REQUESTED', 'ADMIN_REVIEWING', 'PRICE_FINALIZED', 'AWAITING_PAYMENT', 'CONFIRMED'];
    if (!allowedStatuses.includes(payload.status)) {
      const error = new Error('Unsupported status update');
      error.status = 400;
      throw error;
    }
    data.status = payload.status;
  }

  if ('userFinalPrice' in payload) {
    data.userFinalPrice = payload.userFinalPrice;
  }

  if ('ownerPayoutPrice' in payload && !booking.ownerPayoutLockedAt) {
    data.ownerPayoutPrice = payload.ownerPayoutPrice;
  }

  if (payload.appendAdminNote) {
    const previous = booking.adminNotes ? `${booking.adminNotes}
` : '';
    data.adminNotes = `${previous}${payload.appendAdminNote}`.trim();
  } else if ('adminNotes' in payload) {
    data.adminNotes = payload.adminNotes;
  }

  data.updatedAt = new Date();

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data,
    include: {
      bus: { include: { owner: true, pricing: true } },
      owner: { include: { user: true } },
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
  });

  emitToAdmins('booking:negotiation-updated', updated);
  emitToUsers('booking:status-updated', updated);

  if (updated.ownerId) {
    emitToOwners(updated.ownerId, 'booking:status-updated', updated);
  }

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'BOOKING_NEGOTIATION_UPDATE',
      entity: 'Booking',
      entityId: bookingId,
      payload: payload,
    },
  });

  return updated;
}

async function lockOwnerPayout(bookingId, adminId, ownerPayoutPrice) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      ownerPayoutPrice,
      ownerPayoutLockedAt: new Date(),
      status: booking.status === 'PRICE_FINALIZED' ? 'AWAITING_PAYMENT' : booking.status,
    },
    include: {
      bus: { include: { owner: true, pricing: true } },
      owner: { include: { user: true } },
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
  });

  emitToAdmins('booking:owner-payout-locked', updated);
  emitToOwners(updated.ownerId, 'booking:owner-payout-locked', updated);

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'BOOKING_OWNER_PAYOUT_LOCKED',
      entity: 'Booking',
      entityId: bookingId,
      payload: { ownerPayoutPrice },
    },
  });

  return updated;
}

async function lockUserPrice(bookingId, adminId, userFinalPrice) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      userFinalPrice,
      userPriceLockedAt: new Date(),
      status: 'CONFIRMED',
    },
    include: {
      bus: { include: { owner: true, pricing: true } },
      owner: { include: { user: true } },
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
  });

  emitToAdmins('booking:user-price-locked', updated);
  emitToUsers('booking:confirmed', updated);
  emitToOwners(updated.ownerId, 'booking:user-price-locked', updated);

  await prisma.auditLog.create({
    data: {
      actorId: adminId,
      action: 'BOOKING_USER_PRICE_LOCKED',
      entity: 'Booking',
      entityId: bookingId,
      payload: { userFinalPrice },
    },
  });

  return updated;
}

module.exports = {
  createBooking,
  listBookingsForOwner,
  listBookingsForUser,
  listQuoteRequests,
  adminUpdateNegotiation,
  lockOwnerPayout,
  lockUserPrice,
  getBookingForUser,
};
