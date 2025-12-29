/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  const ownerPassword = await bcrypt.hash('Owner@123', saltRounds);
  const userPassword = await bcrypt.hash('User@123', saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@connectiontravels.com' },
    update: {},
    create: {
      email: 'admin@connectiontravels.com',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@connectiontravels.com' },
    update: {},
    create: {
      email: 'owner@connectiontravels.com',
      passwordHash: ownerPassword,
      firstName: 'Olivia',
      lastName: 'Owner',
      phone: '+91-9876543210',
      role: 'OWNER',
      ownerProfile: {
        create: {
          companyName: 'Prime Coaches',
          gstNumber: '29ABCDE1234F1Z5',
          address: 'MG Road, Bengaluru, India',
          city: 'Bengaluru',
          verifiedByAdmin: true,
        },
      },
    },
    include: { ownerProfile: true },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'user@connectiontravels.com' },
    update: {},
    create: {
      email: 'user@connectiontravels.com',
      passwordHash: userPassword,
      firstName: 'Uma',
      lastName: 'User',
      phone: '+91-9123456780',
      role: 'CUSTOMER',
    },
  });

  const bus = await prisma.bus.upsert({
    where: { registrationNo: 'KA09PC2025' },
    update: {},
    create: {
      ownerId: ownerUser.ownerProfile.id,
      title: 'Prime Executive Coach',
      registrationNo: 'KA09PC2025',
      capacity: 40,
      amenities: ['WiFi', 'Recliner Seats', 'Panoramic Roof'],
      description: 'Luxury coach offering premium long-haul comfort.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
      schedules: {
        create: [
          {
            departureDate: new Date(Date.now() + 86400000),
            arrivalDate: new Date(Date.now() + 86400000 * 2),
            origin: 'Bengaluru',
            destination: 'Hyderabad',
            availableSeats: 40,
            price: 1999.99,
            status: 'ACTIVE',
          },
          {
            departureDate: new Date(Date.now() + 86400000 * 3),
            arrivalDate: new Date(Date.now() + 86400000 * 4),
            origin: 'Bengaluru',
            destination: 'Chennai',
            availableSeats: 38,
            price: 1599.5,
            status: 'ACTIVE',
          },
        ],
      },
    },
    include: { schedules: true },
  });

  console.log('Seed completed', { admin, ownerUser, customer, bus });
}

main()
  .catch((e) => {
    console.error('Seed error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
