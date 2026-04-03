import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../../generated/prisma/client'
import { incidentPool } from '../../../../lib/incidents'

const adapter = new PrismaBetterSqlite3({ url: 'file:.prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}))
    const index = body.index ?? Math.floor(Math.random() * incidentPool.length)
    const incident = incidentPool[index]
    const created = await prisma.incident.create({
        data: {
            title: incident.title,
            description: incident.description,
            priority: incident.priority,
            status: 'open'
        }
    })
    return Response.json(created)
}