import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old records...");
  await prisma.telemetryLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.device.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Creating sample laboratory...");
  const lab = await prisma.organization.create({
    data: { name: "Central Lab", city: "Tehran" },
  });

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  console.log("Seeding Pars Azma equipment...");
  const oven = await prisma.device.create({
    data: {
      serialNumber: "EX-200-9011",
      modelName: "Laboratory Oven EX-200",
      status: "OPERATIONAL",
      targetTemp: 200.0,
      calibrationStatus: "CERTIFIED",
      lastCalibrated: new Date(now - 90 * dayMs),
      organizationId: lab.id,
    },
  });
  const furnace = await prisma.device.create({
    data: {
      serialNumber: "MF-1200-4320",
      modelName: "Muffle Furnace MF-1200",
      status: "OPERATIONAL",
      targetTemp: 1200.0,
      calibrationStatus: "PENDING",
      lastCalibrated: new Date(now - 365 * dayMs),
      organizationId: lab.id,
    },
  });
  const vacuum = await prisma.device.create({
    data: {
      serialNumber: "VO-50-8812",
      modelName: "Vacuum Oven VO-50",
      status: "WARNING",
      targetTemp: 180.0,
      calibrationStatus: "EXPIRED",
      lastCalibrated: new Date(now - 400 * dayMs),
      organizationId: lab.id,
    },
  });
  const centrifuge = await prisma.device.create({
    data: {
      serialNumber: "UC-1200-1092",
      modelName: "Universal Laboratory Centrifuge UC-1200",
      status: "OPERATIONAL",
      targetTemp: null,
      calibrationStatus: "CERTIFIED",
      lastCalibrated: new Date(now - 120 * dayMs),
      organizationId: lab.id,
    },
  });
  const germinator = await prisma.device.create({
    data: {
      serialNumber: "PG-500-3341",
      modelName: "Laboratory Plant Germinator PG-500",
      status: "OPERATIONAL",
      targetTemp: 22.0,
      calibrationStatus: "CERTIFIED",
      lastCalibrated: new Date(now - 75 * dayMs),
      organizationId: lab.id,
    },
  });
  const agitator = await prisma.device.create({
    data: {
      serialNumber: "PA-100-7764",
      modelName: "Laboratory Platelet Agitator PA-100",
      status: "OFFLINE",
      targetTemp: null,
      calibrationStatus: "PENDING",
      lastCalibrated: null,
      organizationId: lab.id,
    },
  });
  const incubator = await prisma.device.create({
    data: {
      serialNumber: "INC-400-1122",
      modelName: "Incubator INC-400",
      status: "WARNING",
      targetTemp: 37.0,
      calibrationStatus: "CERTIFIED",
      lastCalibrated: new Date(now - 60 * dayMs),
      organizationId: lab.id,
    },
  });

  console.log("Seeding historical alerts (7-day spread)...");

  await prisma.alert.createMany({
    data: [
      // Today
      {
        severity: "CRITICAL",
        message:
          "Chamber temperature exceeding safe threshold (currently 245°C)",
        status: "Active",
        deviceId: vacuum.id,
        createdAt: new Date(now - 10 * 60000),
      },
      {
        severity: "WARNING",
        message: "Scheduled maintenance overdue",
        status: "Active",
        deviceId: furnace.id,
        createdAt: new Date(now - 2 * 3600000),
      },
      // 1 day ago
      {
        severity: "CRITICAL",
        message: "Vibration levels abnormal",
        status: "Active",
        deviceId: centrifuge.id,
        createdAt: new Date(now - dayMs),
      },
      {
        severity: "WARNING",
        message: "Calibration expiring",
        status: "Acknowledged",
        deviceId: oven.id,
        createdAt: new Date(now - dayMs - 3600000),
      },
      // 2 days ago
      {
        severity: "WARNING",
        message: "Minor door seal integrity warning",
        status: "Resolved",
        deviceId: incubator.id,
        createdAt: new Date(now - 2 * dayMs),
      },
      {
        severity: "WARNING",
        message: "CO2 recovery drift",
        status: "Resolved",
        deviceId: incubator.id,
        createdAt: new Date(now - 2 * dayMs - 10000),
      },
      // 3 days ago
      {
        severity: "CRITICAL",
        message: "Power failure detected",
        status: "Resolved",
        deviceId: agitator.id,
        createdAt: new Date(now - 3 * dayMs),
      },
      // 4 days ago
      {
        severity: "WARNING",
        message: "Relative humidity sensor offline",
        status: "Resolved",
        deviceId: germinator.id,
        createdAt: new Date(now - 4 * dayMs),
      },
      // 5 days ago
      {
        severity: "INFO",
        message: "Firmware update successful",
        status: "Resolved",
        deviceId: oven.id,
        createdAt: new Date(now - 5 * dayMs),
      },
    ],
  });

  console.log("Seeding 24-hour telemetry streams...");
  const telemetryData = [];

  for (let i = 0; i <= 24; i++) {
    const logTime = new Date(now - (24 - i) * 3600000); // Hourly intervals backwards from now

    // Incubator baseline 37.0°C
    telemetryData.push({
      deviceId: incubator.id,
      temperature: +(37.0 + (Math.random() * 0.4 - 0.2)).toFixed(1),
      timestamp: logTime,
    });
    // Oven baseline 200.0°C
    telemetryData.push({
      deviceId: oven.id,
      temperature: +(200 + (Math.random() * 5 - 2.5)).toFixed(1),
      timestamp: logTime,
    });
    // Germinator baseline 22.0°C
    telemetryData.push({
      deviceId: germinator.id,
      temperature: +(22.0 + (Math.random() * 1.5 - 0.75)).toFixed(1),
      timestamp: logTime,
    });
  }

  await prisma.telemetryLog.createMany({ data: telemetryData });

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
