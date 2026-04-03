'use client'

import { useState, useEffect, useRef } from 'react'

interface Incident {
    id: number
    title: string
    description: string
    priority: string
    status: string
    createdAt: string
}

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const surgeRan = useRef(false)

    async function loadIncidents() {
        const res = await fetch('/api/incidents')
        const data = await res.json()
        setIncidents(data)
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const playAlert = () => new Audio('/sounds/alert.wav').play()
    const playBell = () => new Audio('/sounds/bell.wav').play()
    const playWhoosh = () => new Audio('/sounds/whoosh.wav').play()

    useEffect(() => {
        loadIncidents()
        if (surgeRan.current) return
        surgeRan.current = true

        const surge = async () => {
            await delay(1500)

            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 0 }) })
            loadIncidents()
            playAlert()
            await delay(400)
            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 1 }) })
            loadIncidents()
            playAlert()
            await delay(400)
            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 2 }) })
            loadIncidents()
            playAlert()

            await delay(1500)

            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 3 }) })
            loadIncidents()
            playAlert()
            await delay(400)
            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 4 }) })
            loadIncidents()
            playAlert()

            await delay(2000)
            await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 6 }) })
            loadIncidents()
            playBell()
        }

        surge()

    }, [])

    const priorityColor: Record<string, string> = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-orange-400',
        critical: 'text-red-400'
    }

    const priorityBorder: Record<string, string> = {
        low: 'border-green-900',
        medium: 'border-yellow-900',
        high: 'border-orange-900',
        critical: 'border-red-900'
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={async () => {
                            await fetch('/api/incidents', { method: 'DELETE' })
                            window.location.reload()
                        }}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                    >
                        End Shift
                    </button>
                    <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </a>
                </div>
            </header>
            <main className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Active Incidents</h2>
                {incidents.length === 0 && (
                    <p className="text-gray-500 text-sm">Monitoring. No active incidents.</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                    {incidents.map(incident => (
                        <div
                            key={incident.id}
                            className={`bg-gray-800 rounded-lg p-4 border ${priorityBorder[incident.priority]} transition-all`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white text-sm leading-tight pr-2">{incident.title}</h3>
                                <span className={`text-xs font-bold uppercase shrink-0 ${priorityColor[incident.priority]}`}>
                                    {incident.priority}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">{incident.description}</p>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-gray-600 text-xs">
                                    {new Date(incident.createdAt).toLocaleTimeString()}
                                </p>
                                {incident.status === 'open' && (
                                    <button
                                        onClick={async () => {
                                            await fetch('/api/incidents', {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: incident.id, status: 'closed' })
                                            })
                                            loadIncidents()
                                            playWhoosh()
                                        }}
                                        className="text-xs bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-white px-3 py-1 rounded transition-colors"
                                    >
                                        Close
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}