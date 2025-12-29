const prisma = require('../lib/prisma');
const { emitToAdmins, emitToOwners, emitToUsers } = require('../lib/socket');

async function createBooking(userId, payload) {
  const { scheduleId, seatsRequested } = payload;
  if (!scheduleId || !seatsRequested || seatsRequested < 1) {
    const error = new Error('Invalid booking payload');
    error.status = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    const schedule = await tx.busSchedule.findUnique({
      where: { id: scheduleId },
      include: { bus: { include: { owner: true } } },
    });

    if (!schedule || schedule.status !== 'ACTIVE') {
      const error = new Error('Schedule unavailable');
      error.status = 409;
      throw error;
    }

    if (schedule.availableSeats < seatsRequested) {
      const error = new Error('Not enough seats available');
      error.status = 409;
      throw error;
    }

    await tx.busSchedule.update({
      where: { id: scheduleId },
      data: { availableSeats: { decrement: seatsRequested } },
    });

    const totalAmount = schedule.price.mul
      ? schedule.price.mul(seatsRequested)
      : schedule.price * seatsRequested;

    const booking = await tx.booking.create({
      data: {
        userId,
        scheduleId,
        ownerId: schedule.bus.ownerId,
        seatsBooked: seatsRequested,
        totalAmount,
        status: 'CONFIRMED',
      },
      include: {
        schedule: { include: { bus: true } },
      },
    });

    return booking;
  });

  emitToUsers('booking:confirmed', result);
  emitToAdmins('booking:confirmed', result);
  emitToOwners(result.ownerId, 'booking:confirmed', result);

  return result;
}

async function listBookingsForOwner(ownerId) {
  return prisma.booking.findMany({
    where: { ownerId },
    include: {
      schedule: { include: { bus: true } },
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function listBookingsForUser(userId) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      schedule: { include: { bus: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  createBooking,
  listBookingsForOwner,
  listBookingsForUser,
};
