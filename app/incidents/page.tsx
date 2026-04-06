'use client'

import { useState, useEffect, useRef } from 'react'
import { reviewMap, surveyResponses, generateSummary, correctAnswerBonus } from '../../lib/reviewResponses'

interface Incident {
    id: number
    title: string
    description: string
    priority: string
    status: string
    reporter: string
    createdAt: string
}

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<Incident[]>([])
    const [shiftStarted, setShiftStarted] = useState(false)
    const [showSurvey, setShowSurvey] = useState(false)
    const [showEnding, setShowEnding] = useState(false)
    const [score, setScore] = useState(0)
    const [shiftLog, setShiftLog] = useState<{ title: string, priority: string, action: string, points: number }[]>([])
    const [surveyChoice, setSurveyChoice] = useState<string | null>(null)
    const [printerDropped, setPrinterDropped] = useState(false)
    const [surveyAnswered, setSurveyAnswered] = useState(false)
    const [penaltyFlash, setPenaltyFlash] = useState(false)
    const [pointFlash, setPointFlash] = useState<{ amount: number, id: number } | null>(null)
    const scoreRef = useRef(0)
    const totalTicketsRef = useRef(6)
    const walkupAudio = useRef<HTMLAudioElement | null>(null)

    async function loadIncidents(): Promise<Incident[]> {
        const res = await fetch('/api/incidents')
        const data = await res.json()
        const sorted = [...data].sort((a: Incident, b: Incident) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setIncidents(sorted)
        return sorted
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const playAlert = () => new Audio('/sounds/alert.wav').play()
    const playBell = () => new Audio('/sounds/bell.wav').play()
    const playWhoosh = () => new Audio('/sounds/whoosh.wav').play()
    const playWalkup = () => {
        walkupAudio.current = new Audio('/sounds/walkup.wav')
        walkupAudio.current.play()
    }
    const stopWalkup = () => {
        if (walkupAudio.current) {
            walkupAudio.current.pause()
            walkupAudio.current.currentTime = 0
        }
    }

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
    }

    const handleTicketClose = async (incident: Incident, action: { label: string, points: number }) => {
        const isCorrect = correctAnswerBonus[incident.title]?.includes(action.label)
        const multiplier = { low: 1, medium: 1.5, high: 2, critical: 3 }[incident.priority] ?? 1
        const isPenalty = incident.title === "Third submission: System remains down" && action.label === "Duplicate"
        const earned = isPenalty ? -300 : isCorrect ? 300 : Math.round(action.points * multiplier)
        await fetch('/api/incidents', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: incident.id, status: 'closed' })
        })
        const newScore = scoreRef.current + earned
        scoreRef.current = newScore
        setScore(newScore)
        const closedCount = shiftLog.length + 1
        setShiftLog(prev => [...prev, { title: incident.title, priority: incident.priority, action: action.label, points: earned }])

        setPointFlash({ amount: earned, id: Date.now() })
        setTimeout(() => setPointFlash(null), 1000)
        if (isPenalty) {
            playAlert()
            setPenaltyFlash(true)
            setTimeout(() => setPenaltyFlash(false), 1000)
        } else {
            playWhoosh()
        }
        loadIncidents()

        if (closedCount === 6 && !surveyAnswered) {
            await delay(1500)
            playWalkup()
            await delay(800)
            setShowSurvey(true)
            return
        }

        if (closedCount >= totalTicketsRef.current && surveyAnswered) {
            if (newScore >= 500) {
                await delay(1000)
                const currentReport = {
                    shiftLog: [...shiftLog, { title: incident.title, priority: incident.priority, action: action.label, points: earned }],
                    score: newScore,
                    surveyChoice: surveyChoice,
                    timestamp: new Date().toISOString()
                }
                localStorage.setItem('opsdesk-shift-report', JSON.stringify(currentReport))
                const history = JSON.parse(localStorage.getItem('opsdesk-career') || '[]')
                history.push(currentReport)
                localStorage.setItem('opsdesk-career', JSON.stringify(history))
                setShowEnding(true)
                if (newScore >= 1800 || surveyChoice === "PRINTER") playBell()
            } else if (!printerDropped) {
                setPrinterDropped(true)
                totalTicketsRef.current = totalTicketsRef.current + 1
                await delay(1500)
                await fetch('/api/incidents/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ index: 7 }) })
                loadIncidents()
                playAlert()
            }
        }
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

    const priorityGlow: Record<string, string> = {
        low: '0 0 8px rgba(34, 197, 94, 0.3)',
        medium: '0 0 8px rgba(234, 179, 8, 0.3)',
        high: '0 0 8px rgba(249, 115, 22, 0.3)',
        critical: '0 0 8px rgba(239, 68, 68, 0.4)'
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative bg-gray-900 px-3 py-1 rounded border border-gray-700">
                        <span className={`font-mono text-sm font-bold transition-colors duration-300 ${penaltyFlash ? 'text-red-500' : 'text-yellow-400'}`}>Score: {score}</span>
                        {pointFlash && (
                            <span
                                key={pointFlash.id}
                                className={`absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-sm font-bold ${pointFlash.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}
                                style={{ animation: 'fadeUp 1s forwards' }}
                            >
                                {pointFlash.amount >= 0 ? '+' : ''}{pointFlash.amount}
                            </span>
                        )}
                    </div>
                    <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                        ← Dashboard
                    </a>
                </div>
            </header>
            <main className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Active Incidents</h2>
                {incidents.length === 0 && !shiftStarted && (
                    <button
                        onClick={async () => {
                            await fetch('/api/incidents', { method: 'DELETE' })
                            surge()
                        }}
                        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded transition-colors"
                    >
                        Start Shift
                    </button>
                )}
                {incidents.length === 0 && (
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                        <span>Monitoring. No active incidents.</span>
                        {shiftStarted && <span style={{ animation: 'blink 1s infinite' }}>_</span>}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    {incidents.filter(incident => incident.status === 'open').map(incident => (
                        <div
                            key={incident.id}
                            className={`bg-gray-800 rounded-lg p-4 border ${priorityBorder[incident.priority]} hover:brightness-110 transition-all`}
                            style={{
                                animation: 'slideIn 0.3s ease-out',
                                boxShadow: priorityGlow[incident.priority] || 'none'
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white text-sm leading-tight pr-2">{incident.title}</h3>
                                <span className={`text-xs font-bold uppercase shrink-0 ${priorityColor[incident.priority]}`} style={{ animation: 'pulse-soft 2s infinite' }}>
                                    {incident.priority}
                                </span>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">{incident.description}</p>
                            <p className="text-gray-600 text-xs mt-1 italic">Reported by: {incident.reporter}</p>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-gray-700 text-xs">
                                    {new Date(incident.createdAt).toLocaleTimeString()}
                                </p>
                                {incident.status === 'open' && (
                                    <div className="flex gap-1 flex-wrap justify-end">
                                        {[
                                            { label: 'Duplicate', points: 15 },
                                            { label: 'User Error', points: 50 },
                                            { label: 'Escalate', points: 25 },
                                            { label: 'Unresolvable', points: 100 },
                                        ].map(action => (
                                            <button
                                                key={action.label}
                                                onClick={() => handleTicketClose(incident, action)}
                                                className="text-xs bg-gray-700 hover:bg-blue-800 text-gray-300 hover:text-white px-2 py-1 rounded transition-all hover:scale-105"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {showSurvey && (
                <div className="fixed bottom-6 right-6 bg-gray-800 border border-yellow-600 rounded-lg p-6 max-w-md shadow-2xl" style={{ animation: 'slideIn 0.4s ease-out' }}>
                    <p className="text-yellow-400 text-xs font-bold uppercase mb-1">Walk-Up Request</p>
                    <p className="text-white text-sm font-semibold mb-1">Someone is standing at your desk.</p>
                    <p className="text-gray-400 text-xs mb-4">Linda Marsh, Office Manager, is here about the printer. She does not have a ticket. She has never had a ticket. She would like this resolved now. The printer is on Floor 3. You already know this.</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={async () => {
                                stopWalkup()
                                await fetch('/api/incidents', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ title: "RE: Was told to submit a ticket", description: "Office Manager directed to submit ticket per protocol. Office Manager has submitted ticket. Ticket subject: Was told to submit a ticket. Ticket priority: Urgent. Original printer issue not addressed.", priority: "low", reporter: "Linda Marsh, Office Manager (in person)" })
                                })
                                const surveyBonus = 700
                                const newScore = scoreRef.current + surveyBonus
                                scoreRef.current = newScore
                                setScore(newScore)
                                totalTicketsRef.current = totalTicketsRef.current + 1
                                setSurveyChoice("PRINTER")
                                setSurveyAnswered(true)
                                loadIncidents()
                                playWhoosh()
                                setShowSurvey(false)
                            }}
                            className="text-left bg-gray-700 hover:bg-blue-900 text-gray-300 hover:text-white text-xs px-4 py-3 rounded transition-all hover:scale-[1.02]"
                        >
                            <span className="font-bold text-yellow-400 mr-2">A.</span>Direct her to the ticketing system. She will submit a ticket. The ticket will be about being asked to submit a ticket.
                        </button>
                        <button
                            onClick={async () => {
                                stopWalkup()
                                await fetch('/api/incidents', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ title: "RE: Confirmation of resolution — confirmation requested", description: "Technician visited Floor 3 at request of Office Manager. Printer examined. Issue resolved. Office Manager has submitted a ticket confirming resolution. Ticket requests written confirmation that the resolution is confirmed. Printer toner light remains amber. It was not part of the resolution.", priority: "low", reporter: "Linda Marsh, Office Manager (in person)" })
                                })
                                const surveyBonus = 700
                                const newScore = scoreRef.current + surveyBonus
                                scoreRef.current = newScore
                                setScore(newScore)
                                totalTicketsRef.current = totalTicketsRef.current + 1
                                setSurveyChoice("PRINTER")
                                setSurveyAnswered(true)
                                loadIncidents()
                                playWhoosh()
                                setShowSurvey(false)
                            }}
                            className="text-left bg-gray-700 hover:bg-blue-900 text-gray-300 hover:text-white text-xs px-4 py-3 rounded transition-all hover:scale-[1.02]"
                        >
                            <span className="font-bold text-yellow-400 mr-2">B.</span>Accompany Linda to Floor 3. Confirm the toner light is amber. Resolve the issue. Linda will submit a ticket confirming the issue has been resolved. The ticket will request confirmation of the resolution. The resolution will require a ticket.
                        </button>
                    </div>
                </div>
            )}
            {showEnding && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" style={{ animation: 'slideIn 0.5s ease-out' }}>
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full shadow-2xl text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-4">Shift Complete</p>
                        <p className="text-yellow-400 font-mono text-2xl font-bold mb-2">{score} pts</p>
                        <p className="text-gray-400 text-xs mb-2">All incidents resolved. Your shift log has been filed.</p>
                        <p className="text-gray-500 text-xs mb-6">Review your performance in the Runbook Library. Then clock out. Or don't. The building is always open. The lights do not turn off.</p>
                        <div className="flex flex-col gap-2">
                            <button onClick={async () => { await fetch('/api/incidents', { method: 'DELETE' }); window.location.href = "/runbook"; }} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View Shift Log</button>
                            <button onClick={async () => { await fetch('/api/incidents', { method: 'DELETE' }); window.location.href = "/"; }} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Clock Out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}