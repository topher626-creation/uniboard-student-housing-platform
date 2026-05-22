import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Property from '../models/Property.js';
import { hashPassword } from '../utils/auth.js';

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    // Create admin
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      email: 'admin@uniboard.zm',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'admin',
      isVerified: true,
      isBlocked: false,
    } as any);
    console.log('✅ Admin created:', admin.email);

    // Create student
    const studentPassword = await hashPassword('student123');
    const student = await User.create({
      email: 'student@uniboard.zm',
      password: studentPassword,
      fullName: 'John Doe',
      phone: '+260123456789',
      role: 'student',
      isVerified: true,
      isBlocked: false,
    } as any);
    console.log('✅ Student created:', student.email);

    // Create provider
    const providerPassword = await hashPassword('provider123');
    const providerUser = await User.create({
      email: 'provider@uniboard.zm',
      password: providerPassword,
      fullName: 'Jane Smith',
      phone: '+260987654321',
      role: 'provider',
      isVerified: true,
      isBlocked: false,
    } as any);
    console.log('✅ Provider user created:', providerUser.email);

    // Create provider profile
    const provider = await Provider.create({
      userId: providerUser.id,
      businessName: 'Elite Accommodations',
      businessEmail: 'info@elite-accom.zm',
      businessPhone: '+260987654321',
      isApproved: true,
      approvedAt: new Date(),
      avgRating: 0,
      totalListings: 0,
      totalBookings: 0,
    } as any);
    console.log('✅ Provider profile created:', provider.businessName);

    // Create sample properties
    const universities = ['UNZA', 'MUKUBA', 'CBU', 'Mulungushi', 'UNILUS'];
    const locations = ['Ridgeway', 'Kabulonga', 'Cathedral', 'Lusaka Central', 'Northmead'];

    for (let i = 0; i < 5; i++) {
      const property = await Property.create({
        providerId: provider.id,
        title: `Modern ${i + 1} Bedroom Apartment`,
        description: `Fully furnished comfortable bedroom near ${universities[i]}. WiFi, water, and 24/7 security included.`,
        nearestUniversity: universities[i],
        location: locations[i],
        latitude: -12.8 + (i * 0.02),
        longitude: 28.3 + (i * 0.02),
        pricePerMonth: 450 + (i * 100),
        bedType: i % 2 === 0 ? 'private' : 'shared',
        genderPreference: 'any',
        availableFrom: new Date(),
        totalRooms: 2 + i,
        occupiedRooms: 0,
        amenities: ['WiFi', 'Water Supply', 'Security', '24/7 Electricity'],
        images: [
          `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400`,
        ],
        isApproved: true,
        approvedAt: new Date(),
        isActive: true,
        views: 0,
        avgRating: 0,
      } as any);
      console.log(`✅ Property created: ${property.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('  Admin: admin@uniboard.zm / admin123');
    console.log('  Student: student@uniboard.zm / student123');
    console.log('  Provider: provider@uniboard.zm / provider123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
