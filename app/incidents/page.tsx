'use client'

import { useState, useEffect } from 'react'

interface Incident {
    id: number
    title: string
    description: string
    priority: string
    status: string
    createdAt: string
}

export default function IncidentsPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [incidents, setIncidents] = useState<Incident[]>([])

    async function loadIncidents() {
        const res = await fetch('/api/incidents')
        const data = await res.json()
        setIncidents(data)
    }

    useEffect(() => {
        loadIncidents()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        await fetch('/api/incidents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority })
        })
        setTitle('')
        setDescription('')
        setPriority('medium')
        loadIncidents()
    }

    const priorityColor: Record<string, string> = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-orange-400',
        critical: 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
                </div>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    ← Dashboard
                </a>
            </header>
            <main className="p-6 max-w-3xl">

                <h2 className="text-xl font-semibold text-white mb-4">Log New Incident</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
                    <input
                        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                        placeholder="Incident title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                        placeholder="Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        required
                    />
                    <select
                        className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded"
                    >
                        Log Incident
                    </button>
                </form>

                <h2 className="text-xl font-semibold text-white mb-4">Active Incidents</h2>
                <div className="flex flex-col gap-4">
                    {incidents.length === 0 && (
                        <p className="text-gray-400">No incidents logged yet.</p>
                    )}
                    {incidents.map(incident => (
                        <div key={incident.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-white">{incident.title}</h3>
                                <span className={`text-sm font-bold uppercase ${priorityColor[incident.priority]}`}>
                                    {incident.priority}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{incident.description}</p>
                            <p className="text-gray-600 text-xs mt-2">
                                {new Date(incident.createdAt).toLocaleString()}
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
                                    }}
                                    className="mt-3 text-xs bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-white px-3 py-1 rounded transition-colors"
                                >
                                    Close Incident
                                </button>
                            )}
                        </div>
                    ))}
                </div>

            </main>
        </div>
    )
}