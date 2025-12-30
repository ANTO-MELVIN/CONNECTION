const prisma = require('../lib/prisma');
const { emitToUsers, emitToAdmins, emitToOwners } = require('../lib/socket');

function formatMedia(media) {
  if (!media) {
    return media;
  }
  const base64 = media.data ? media.data.toString('base64') : null;
  return {
    id: media.id,
    busId: media.busId,
    fileName: media.fileName,
    mimeType: media.mimeType,
    kind: media.kind,
    url: media.url,
    data: base64,
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
  };
}

function prepareMediaRecords(busId, mediaItems = []) {
  return mediaItems
    .map((item) => {
      if (!item || typeof item.data !== 'string') {
        return null;
      }
      const base64Payload = item.data.includes(',') ? item.data.split(',').pop() : item.data;
      if (!base64Payload) {
        return null;
      }

      try {
        const buffer = Buffer.from(base64Payload, 'base64');
        return {
          busId,
          fileName: item.fileName || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          mimeType: item.mimeType || 'application/octet-stream',
          kind: item.kind === 'VIDEO' ? 'VIDEO' : 'IMAGE',
          data: buffer,
        };
      } catch (error) {
        console.error('Failed to parse media payload', error);
        return null;
      }
    })
    .filter(Boolean);
}

async function listActiveBuses() {
  const buses = await prisma.bus.findMany({
    where: { active: true, approvalStatus: 'APPROVED' },
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
      media: true,
    },
  });
  return buses.map(formatBus);
}

async function getOwnerBuses(ownerId) {
  const buses = await prisma.bus.findMany({
    where: { ownerId },
    include: { schedules: true, media: true },
    orderBy: { createdAt: 'desc' },
  });
  return buses.map(formatBus);
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
      approvalStatus: 'PENDING',
      approvalNote: null,
      active: false,
    },
  });

  if (Array.isArray(payload.media) && payload.media.length > 0) {
    const records = prepareMediaRecords(bus.id, payload.media);
    if (records.length > 0) {
      await prisma.busMedia.createMany({ data: records });
    }
  }

  const hydratedBus = await prisma.bus.findUnique({
    where: { id: bus.id },
    include: { media: true, schedules: true },
  });

  const formattedBus = formatBus(hydratedBus);

  emitToAdmins('bus:pending', formattedBus);
  emitToOwners(ownerId, 'bus:created', formattedBus);

  return formattedBus;
}

async function updateBus(ownerId, busId, payload) {
  const existing = await prisma.bus.findFirst({
    where: { id: busId, ownerId },
  });

  if (!existing) {
    throw new Error('Bus not found');
  }

  const data = {};
  const fieldsRequiringApproval = ['title', 'description', 'capacity', 'amenities'];
  let requiresApproval = false;

  if (typeof payload.title === 'string' && payload.title !== existing.title) {
    data.title = payload.title;
    requiresApproval = true;
  }

  if ('description' in payload) {
    const nextDescription = payload.description ?? null;
    if (nextDescription !== existing.description) {
      data.description = nextDescription;
      requiresApproval = true;
    }
  }

  if ('capacity' in payload && typeof payload.capacity === 'number' && payload.capacity !== existing.capacity) {
    data.capacity = payload.capacity;
    requiresApproval = true;
  }

  if (Array.isArray(payload.amenities)) {
    const currentAmenities = existing.amenities ?? [];
    const nextAmenities = payload.amenities;
    const hasChanged =
      currentAmenities.length !== nextAmenities.length ||
      currentAmenities.some((item, idx) => item !== nextAmenities[idx]);
    if (hasChanged) {
      data.amenities = nextAmenities;
      requiresApproval = true;
    }
  }

  if ('active' in payload && typeof payload.active === 'boolean') {
    data.active = payload.active;
  }

  if (requiresApproval) {
    data.approvalStatus = 'PENDING';
    data.approvalNote = null;
    data.active = false;
  }

  if (Object.keys(data).length === 0) {
    const unchangedBus = await prisma.bus.findUnique({
      where: { id: busId },
      include: { schedules: true, media: true },
    });
    return formatBus(unchangedBus);
  }

  const bus = await prisma.bus.update({
    where: { id: busId },
    data,
    include: { schedules: true, media: true },
  });

  if (Array.isArray(payload.media) && payload.media.length > 0) {
    await prisma.busMedia.deleteMany({ where: { busId } });
    const records = prepareMediaRecords(busId, payload.media);
    if (records.length > 0) {
      await prisma.busMedia.createMany({ data: records });
    }
  }

  const formattedBus = formatBus(bus);

  if (requiresApproval) {
    emitToAdmins('bus:pending', formattedBus);
    emitToOwners(ownerId, 'bus:updated', formattedBus);
  } else {
    broadcastBusUpdate(ownerId, formattedBus);
  }

  return formattedBus;
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
    include: { schedules: true, media: true },
  });

  broadcastBusUpdate(ownerId, formatBus(bus));

  return schedule;
}

async function getBusSchedules(busId) {
  return prisma.busSchedule.findMany({
    where: { busId, status: 'ACTIVE' },
    orderBy: { departureDate: 'asc' },
  });
}

function broadcastBusUpdate(ownerId, bus) {
  emitToAdmins('bus:updated', bus);
  emitToOwners(ownerId, 'bus:updated', bus);
  if (bus.approvalStatus === 'APPROVED' && bus.active) {
    emitToUsers('bus:updated', bus);
  }
}

module.exports = {
  listActiveBuses,
  getOwnerBuses,
  createBus,
  updateBus,
  upsertSchedule,
  getBusSchedules,
};
