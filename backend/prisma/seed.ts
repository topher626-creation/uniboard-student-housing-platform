import { prisma } from '../src/lib/db';
import { hash } from 'bcryptjs';

async function main() {
  const hashedStudentPass = await hash('UniBoard@2026', 12);
  const hashedLandlordPass = await hash('LandlordPass#88', 12);
  const hashedAdminPass = await hash('AdminSecure$99', 12);

  // Demo users with new status/adminLevel
  await prisma.user.upsert({
    where: { email: 'chipo@student.unza.zm' },
    update: {},
    create: {
      id: 'user-001',
      fullName: 'Chipo Mwanza',
      email: 'chipo@student.unza.zm',
      password: hashedStudentPass,
      role: 'STUDENT',
      status: 'ACTIVE',
      university: 'UNZA',
      phone: '+260 97 111 2222',
      phoneVerified: true,
    }
  });

  await prisma.user.upsert({
    where: { email: 'chanda@mwaleresidences.zm' },
    update: {},
    create: {
      id: 'user-002',
      fullName: 'Chanda Mwale',
      email: 'chanda@mwaleresidences.zm',
      password: hashedLandlordPass,
      role: 'LANDLORD',
      status: 'ACTIVE',
      phone: '+260 97 123 4567',
      phoneVerified: true,
      nrcImages: [
        {url: '/uploads/nrc/chanda-front.jpg', side: 'front'},
        {url: '/uploads/nrc/chanda-back.jpg', side: 'back'}
      ]
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@uniboard.zm' },
    update: {},
    create: {
      id: 'user-003',
      fullName: 'Admin UniBoard',
      email: 'admin@uniboard.zm',
      password: hashedAdminPass,
      role: 'ADMIN',
      status: 'ACTIVE',
      adminLevel: 'SUPER',
    }
  });

  await prisma.user.upsert({
    where: { email: 'assistant@uniboard.zm' },
    update: {},
    create: {
      id: 'user-004',
      fullName: 'Assistant Admin',
      email: 'assistant@uniboard.zm',
      password: hashedAdminPass,
      role: 'ADMIN',
      status: 'ACTIVE',
      adminLevel: 'ASSISTANT',
    }
  });

  // Universities
  await prisma.university.createMany({
    data: [
      { id: 'unza', name: 'UNZA', fullName: 'University of Zambia', city: 'Lusaka', color: 'bg-green-100 text-green-700' },
      { id: 'cbu', name: 'CBU', fullName: 'Copperbelt University', city: 'Kitwe', color: 'bg-blue-100 text-blue-700' },
      { id: 'mukuba', name: 'MUKUBA', fullName: 'Mukuba University', city: 'Kitwe', color: 'bg-amber-100 text-amber-700' },
    ],
    skipDuplicates: true
  });

  // Demo Compound for landlord
  await prisma.compound.upsert({
    where: { id: 'comp-001' },
    update: {},
    create: {
      id: 'comp-001',
      name: 'Mwale Student Residences',
      description: 'Premium student accommodation near UNZA',
      location: 'Northmead, Lusaka',
      userId: 'user-002',
    }
  });

  // Demo Building
  await prisma.building.upsert({
    where: { id: 'build-001' },
    update: {},
    create: {
      id: 'build-001',
      name: 'Jilafu Building',
      description: 'Modern building with en-suite rooms',
      location: 'Northmead Main Road',
      roomType: 'SELF_CONTAINED',
      images: [{url: '/demo/building1.jpg', alt: 'Building exterior'}],
      totalBeds: 20,
      occupiedBeds: 12,
      features: ['WiFi', 'Water', 'Security', 'Electricity'],
      compoundId: 'comp-001',
    }
  });

  // Demo Property
  await prisma.property.upsert({
    where: { id: 'prop-001' },
    update: {},
    create: {
      id: 'prop-001',
      name: 'En-suite Room 101',
      description: 'Private en-suite room with study desk',
      price: 2800,
      roomType: 'SELF_CONTAINED',
      phone: '+260971234567',
      whatsapp: '+260971234567',
      images: [{url: '/demo/room101.jpg', alt: 'Room view'}],
      features: ['WiFi', 'Private Bathroom', 'Study Desk'],
      totalBeds: 1,
      occupiedBeds: 0,
      travelTime: '5 minutes',
      buildingId: 'build-001',
    }
  });

  // Demo Manager-Agent
  await prisma.user.upsert({
    where: { email: 'manager@mwale.zm' },
    update: {},
    create: {
      id: 'user-005',
      fullName: 'Kelvin Phiri',
      email: 'manager@mwale.zm',
      password: hashedLandlordPass,
      role: 'MANAGER',
      status: 'ACTIVE',
      phone: '+260974567890',
    }
  });

  await prisma.managerAgent.upsert({
    where: { id: 'ma-001' },
    update: {},
    create: {
      id: 'ma-001',
      role: 'MANAGER',
      permissions: {
        editDetails: true,
        manageBeds: true,
        addAgents: true
      },
      managerId: 'user-005',
      landlordId: 'user-002'
    }
  });

  console.log('✅ Seeding complete with new schema!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

