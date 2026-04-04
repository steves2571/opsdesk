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
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [shiftStarted, setShiftStarted] = useState(false)
    const [showSurvey, setShowSurvey] = useState(false)
    const [showEnding, setShowEnding] = useState(false)

    async function loadIncidents() {
        const res = await fetch('/api/incidents')
        const data = await res.json()
        setIncidents([...data].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
    }
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const playAlert = () => new Audio('/sounds/alert.wav').play()
    const playBell = () => new Audio('/sounds/bell.wav').play()
    const playWhoosh = () => new Audio('/sounds/whoosh.wav').play()

    const surge = async () => {
        setShiftStarted(true)
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
        await delay(3000)
        setShowSurvey(true)
    }

    useEffect(() => {
        fetch('/api/incidents', { method: 'DELETE' }).then(() => loadIncidents())
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
                    <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </a>
                </div>
            </header>
            <main className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Active Incidents</h2>
                {incidents.length === 0 && !shiftStarted && (
                    <button
                        onClick={() => surge()}
                        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded transition-colors"
                    >
                        Start Shift
                    </button>
                )}
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
            {showSurvey && (
                <div className="fixed bottom-6 right-6 bg-gray-800 border border-blue-500 rounded-lg p-6 max-w-md shadow-2xl">
                    <p className="text-blue-400 text-xs font-bold uppercase mb-1">Post-Shift Assessment</p>
                    <p className="text-white text-sm font-semibold mb-1">Your session has generated 6 incidents.</p>
                    <p className="text-gray-400 text-xs mb-4">Please select the option that best describes your current situation. This is required.</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "A", text: "I have not received a response to my email. I sent a follow up. I sent a follow up to the follow up. I have been told they are looping someone in. That was Thursday.", priority: "medium", title: "Email chain unresponsive — follow up to follow up submitted" },
                            { label: "B", text: "The printer was working this morning. I did not touch the printer. Nobody touched the printer. The printer has decided. We respect the printer's decision.", priority: "low", title: "Printer has entered unknown autonomous state — do not approach" },
                            { label: "C", text: "There is a meeting on my calendar for 7am. I did not accept this meeting. I do not know who scheduled it. It is now 6:45am on a Saturday. I am on the call.", priority: "high", title: "Unauthorized calendar event — attendee present. Attendee had no choice." },
                        ].map(option => (
                            <button
                                key={option.label}
                                onClick={async () => {
                                    await fetch('/api/incidents', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ title: option.title, description: option.text, priority: option.priority })
                                    })
                                    loadIncidents()
                                    playWhoosh()
                                    setShowSurvey(false)
                                    await delay(1000)
                                    setShowEnding(true)
                                }}
                                className="text-left bg-gray-700 hover:bg-blue-900 text-gray-300 hover:text-white text-xs px-4 py-3 rounded transition-colors"
                            >
                                <span className="font-bold text-blue-400 mr-2">{option.label}.</span>{option.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {showEnding && (
                <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md shadow-2xl">
                    <p className="text-gray-500 text-xs font-bold uppercase mb-3">Post-Incident Review</p>
                    <p className="text-white text-sm mb-2">Thank you for your participation. Your incident has been logged and assigned.</p>
                    <p className="text-gray-400 text-xs mb-1">Estimated resolution: next quarter, pending alignment.</p>
                    <p className="text-gray-400 text-xs mb-4">This concludes your shift.</p>
                    <div className="border-t border-gray-700 pt-4">
                        <p className="text-gray-600 text-xs">The printer is still deciding.</p>
                    </div>
                    <button
                        onClick={() => setShowEnding(false)}
                        className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                    >
                        Acknowledge
                    </button>
                </div>
            )}
        </div>
    )
}