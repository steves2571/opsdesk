import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../generated/prisma/client'

const adapter = new PrismaBetterSqlite3({ url: 'file:.prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

export async function GET() {
  const incidents = await prisma.incident.findMany()
  return Response.json(incidents)
}

export async function POST(request: Request) {
  const body = await request.json()
  const incident = await prisma.incident.create({
    data: {
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
    }
  })
  return Response.json(incident)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const incident = await prisma.incident.update({
    where: { id: body.id },
    data: { status: body.status }
  })
  return Response.json(incident)
}
export async function DELETE() {
  await prisma.incident.deleteMany()
  return Response.json({ message: 'Board cleared' })
}