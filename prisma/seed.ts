import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old records...')
  await prisma.device.deleteMany()
  await prisma.organization.deleteMany()

  console.log('Creating sample laboratory...')
  const lab = await prisma.organization.create({
    data: {
      name: 'Central Lab',
      city: 'Tehran',
    },
  })

  console.log('Seeding Pars Azma equipment...')
  const devices = [
    {
      serialNumber: 'EX-200-9011',
      modelName: 'Laboratory Oven EX-200',
      status: 'OPERATIONAL',
      warrantyEnd: new Date('2027-05-15'),
      organizationId: lab.id,
    },
    {
      serialNumber: 'MF-1200-4320',
      modelName: 'Muffle Furnace MF-1200',
      status: 'OPERATIONAL',
      warrantyEnd: new Date('2026-11-20'),
      organizationId: lab.id,
    },
    {
      serialNumber: 'VO-50-8812',
      modelName: 'Vacuum Oven VO-50',
      status: 'WARNING',
      warrantyEnd: new Date('2025-08-10'),
      organizationId: lab.id,
    },
    {
      serialNumber: 'UC-1200-1092',
      modelName: 'Universal Laboratory Centrifuge UC-1200',
      status: 'OPERATIONAL',
      warrantyEnd: new Date('2027-01-01'),
      organizationId: lab.id,
    },
    {
      serialNumber: 'PG-500-3341',
      modelName: 'Laboratory Plant Germinator PG-500',
      status: 'OPERATIONAL',
      warrantyEnd: new Date('2026-12-31'),
      organizationId: lab.id,
    },
    {
      serialNumber: 'PA-100-7764',
      modelName: 'Laboratory Platelet Agitator PA-100',
      status: 'OFFLINE',
      warrantyEnd: new Date('2025-04-12'),
      organizationId: lab.id,
    },
  ]

  for (const device of devices) {
    await prisma.device.create({ data: device })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })