const prisma = require('../lib/prisma');
const { emitToUsers, emitToAdmins, emitToOwners } = require('../lib/socket');

async function listActiveBuses() {
  return prisma.bus.findMany({
    where: { active: true },
    include: {
      owner: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      schedules: {
        where: { status: 'ACTIVE' },
      },
    },
  });
}

async function getOwnerBuses(ownerId) {
  return prisma.bus.findMany({
    where: { ownerId },
    include: { schedules: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function createBus(ownerId, payload) {
  const bus = await prisma.bus.create({
    data: {
      ownerId,
      title: payload.title,
      registrationNo: payload.registrationNo,
      capacity: payload.capacity,
      description: payload.description || null,
      amenities: payload.amenities || [],
    },
  });

  emitToAdmins('bus:created', bus);
  emitToUsers('bus:created', bus);
  emitToOwners(ownerId, 'bus:created', bus);

  return bus;
}

async function updateBus(ownerId, busId, payload) {
  const bus = await prisma.bus.update({
    where: { id: busId, ownerId },
    data: {
      title: payload.title,
      description: payload.description ?? null,
      amenities: payload.amenities ?? [],
      capacity: payload.capacity,
      active: payload.active ?? true,
    },
    include: { schedules: true },
  });

  broadcastBusUpdate(ownerId, bus);

  return bus;
}

async function upsertSchedule(ownerId, busId, data) {
  let schedule;
  if (data.id) {
    schedule = await prisma.busSchedule.update({
      where: { id: data.id },
      data: {
        departureDate: new Date(data.departureDate),
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        origin: data.origin,
        destination: data.destination,
        availableSeats: data.availableSeats,
        price: data.price,
        status: data.status,
        statusReason: data.statusReason ?? null,
      },
    });
  } else {
    schedule = await prisma.busSchedule.create({
      data: {
        busId,
        departureDate: new Date(data.departureDate),
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        origin: data.origin,
        destination: data.destination,
        availableSeats: data.availableSeats,
        price: data.price,
        status: data.status || 'ACTIVE',
        statusReason: data.statusReason ?? null,
      },
    });
  }

  const bus = await prisma.bus.findUnique({
    where: { id: busId },
    include: { schedules: true },
  });

  broadcastBusUpdate(ownerId, bus);

  return schedule;
}

async function getBusSchedules(busId) {
  return prisma.busSchedule.findMany({
    where: { busId, status: 'ACTIVE' },
    orderBy: { departureDate: 'asc' },
  });
}

function broadcastBusUpdate(ownerId, bus) {
  emitToUsers('bus:updated', bus);
  emitToAdmins('bus:updated', bus);
  emitToOwners(ownerId, 'bus:updated', bus);
}

module.exports = {
  listActiveBuses,
  getOwnerBuses,
  createBus,
  updateBus,
  upsertSchedule,
  getBusSchedules,
};
