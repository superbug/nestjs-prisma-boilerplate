import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Running seed...');

  // Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      role: Role.Admin,
      firstName: 'Admin',
      lastName: 'User',
      isEmailVerified: true,
    },
  });

  // Create Account for Admin User (for credential-based auth)
  await prisma.account.upsert({
    where: { id: 'admin-account-1' },
    update: {},
    create: {
      id: 'admin-account-1',
      userId: adminUser.id,
      accountId: adminUser.id,
      providerId: 'credential',
      password: '$2a$10$YourHashedPasswordHere', // Replace with actual hashed password
    },
  });

  // Create Regular User
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      role: Role.User,
      firstName: 'Regular',
      lastName: 'User',
      isEmailVerified: true,
    },
  });

  // Create Account for Regular User
  await prisma.account.upsert({
    where: { id: 'user-account-1' },
    update: {},
    create: {
      id: 'user-account-1',
      userId: regularUser.id,
      accountId: regularUser.id,
      providerId: 'credential',
      password: '$2a$10$YourHashedPasswordHere', // Replace with actual hashed password
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
