import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/prisma/client'
import { incidentPool } from '../../../../lib/incidents'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

export async function GET() {
    try {
        const incidents = await prisma.incident.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return Response.json(incidents)
    } catch (error) {
        console.error('GET /api/incidents error:', error)
        return Response.json([], { status: 200 })
    }
}

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