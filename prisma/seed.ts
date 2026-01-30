import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash("Admin12345!", 12);
  const organizerPasswordHash = await bcrypt.hash("Organizer123!", 12);
  const staffPasswordHash = await bcrypt.hash("Staff12345!", 12);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventops.dev" },
    update: {},
    create: {
      email: "admin@eventops.dev",
      name: "EventOps Admin",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Create Organizer user
  const organizer = await prisma.user.upsert({
    where: { email: "organizer@eventops.dev" },
    update: {},
    create: {
      email: "organizer@eventops.dev",
      name: "Main Organizer",
      passwordHash: organizerPasswordHash,
      role: "ORGANIZER",
    },
  });
  console.log("✅ Organizer user:", organizer.email);

  // Create Staff users
  const staff1 = await prisma.user.upsert({
    where: { email: "staff1@eventops.dev" },
    update: {},
    create: {
      email: "staff1@eventops.dev",
      name: "Staff Member 1",
      passwordHash: staffPasswordHash,
      role: "STAFF",
    },
  });
  console.log("✅ Staff user 1:", staff1.email);

  const staff2 = await prisma.user.upsert({
    where: { email: "staff2@eventops.dev" },
    update: {},
    create: {
      email: "staff2@eventops.dev",
      name: "Staff Member 2",
      passwordHash: staffPasswordHash,
      role: "STAFF",
    },
  });
  console.log("✅ Staff user 2:", staff2.email);

  // Create Event A (DRAFT)
  const now = Date.now();
  const eventA = await prisma.event.upsert({
    where: {
      id: "seed-event-a",
    },
    update: {},
    create: {
      id: "seed-event-a",
      title: "Event A",
      description: "Sample draft event for testing",
      venue: "Main Hall",
      startAt: new Date(now + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endAt: new Date(now + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 7 days + 3 hours
      capacity: 50,
      status: "DRAFT",
      organizerId: organizer.id,
    },
  });
  console.log("✅ Event A:", eventA.title, `(${eventA.status})`);

  // Create Event B (PUBLISHED)
  const eventB = await prisma.event.upsert({
    where: {
      id: "seed-event-b",
    },
    update: {},
    create: {
      id: "seed-event-b",
      title: "Event B",
      description: "Sample published event for testing",
      venue: "Convention Center",
      startAt: new Date(now + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      endAt: new Date(now + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 14 days + 5 hours
      capacity: 120,
      status: "PUBLISHED",
      organizerId: organizer.id,
    },
  });
  console.log("✅ Event B:", eventB.title, `(${eventB.status})`);

  // Create Assignments for Event B
  const assignment1 = await prisma.assignment.upsert({
    where: {
      eventId_userId_roleName: {
        eventId: eventB.id,
        userId: staff1.id,
        roleName: "Usher",
      },
    },
    update: {},
    create: {
      eventId: eventB.id,
      userId: staff1.id,
      roleName: "Usher",
    },
  });
  console.log("✅ Assignment 1: staff1 -> Event B (Usher)");

  const assignment2 = await prisma.assignment.upsert({
    where: {
      eventId_userId_roleName: {
        eventId: eventB.id,
        userId: staff2.id,
        roleName: "Security",
      },
    },
    update: {},
    create: {
      eventId: eventB.id,
      userId: staff2.id,
      roleName: "Security",
    },
  });
  console.log("✅ Assignment 2: staff2 -> Event B (Security)");

  // Create Check-ins for Event B (by staff1)
  // Delete existing seed check-ins first for idempotency
  await prisma.checkIn.deleteMany({
    where: {
      id: {
        in: ["seed-checkin-1", "seed-checkin-2", "seed-checkin-3"],
      },
    },
  });

  const checkIn1 = await prisma.checkIn.create({
    data: {
      id: "seed-checkin-1",
      eventId: eventB.id,
      attendeeName: "John Doe",
      attendeeEmail: "john.doe@example.com",
      checkedInByUserId: staff1.id,
    },
  });
  console.log("✅ Check-in 1:", checkIn1.attendeeName);

  const checkIn2 = await prisma.checkIn.create({
    data: {
      id: "seed-checkin-2",
      eventId: eventB.id,
      attendeeName: "Jane Smith",
      attendeeEmail: "jane.smith@example.com",
      checkedInByUserId: staff1.id,
    },
  });
  console.log("✅ Check-in 2:", checkIn2.attendeeName);

  const checkIn3 = await prisma.checkIn.create({
    data: {
      id: "seed-checkin-3",
      eventId: eventB.id,
      attendeeName: "Bob Johnson",
      checkedInByUserId: staff1.id,
    },
  });
  console.log("✅ Check-in 3:", checkIn3.attendeeName);

  // Summary
  const userCount = await prisma.user.count();
  const eventCount = await prisma.event.count();
  const assignmentCount = await prisma.assignment.count();
  const checkInCount = await prisma.checkIn.count();

  console.log("\n📊 Seed Summary:");
  console.log(`   Users: ${userCount}`);
  console.log(`   Events: ${eventCount}`);
  console.log(`   Assignments: ${assignmentCount}`);
  console.log(`   Check-ins: ${checkInCount}`);
  console.log("\n✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

