import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const SUCURSALES = [
  { Id: 1, Nombre: 'VENTANAS' },
  { Id: 3, Nombre: 'VINCES' },
  { Id: 4, Nombre: 'PECHICHE' },
  { Id: 5, Nombre: 'PALENQUE' },
  { Id: 6, Nombre: 'PALENQUE 2' },
  { Id: 7, Nombre: 'PEDRO CARBO' },
  { Id: 8, Nombre: 'LA YOLANDA' },
]

async function main() {
  console.log('Seeding database...')

  // ─── Admin User ───────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('admin1234', 10)

  const admin = await prisma.user.upsert({
    where: { Email: 'admin@survey.com' },
    update: {},
    create: {
      Email: 'admin@survey.com',
      PasswordHash: passwordHash,
      Name: 'Admin',
    },
  })

  console.log('✓ Admin:', admin.Email)

  // ─── Sucursales (IDs forzados) ─────────────────────────────────────────────

  for (const s of SUCURSALES) {
    await prisma.sucursal.upsert({
      where: { Id: s.Id },
      update: { Nombre: s.Nombre },
      create: { Id: s.Id, Nombre: s.Nombre },
    })
    console.log(`✓ Sucursal ${s.Id}: ${s.Nombre}`)
  }

  // Resetear la secuencia al max Id para que futuros inserts no colisionen
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Sucursal"', 'Id'),
      (SELECT MAX("Id") FROM "Sucursal")
    )
  `

  console.log('✓ Sequence reset')
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
