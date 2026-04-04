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
    const scoreRef = useRef(0)
    const totalTicketsRef = useRef(6)

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

    const handleTicketClose = async (incident: Incident, action: { label: string, points: number }) => {
        const isCorrect = correctAnswerBonus[incident.title]?.includes(action.label)
        const multiplier = { low: 1, medium: 1.5, high: 2, critical: 3 }[incident.priority] ?? 1
        const isPenalty = (incident.title === "Third submission: System remains down" && action.label === "Duplicate") || (incident.title === "VP of Marketing: workstation still slow — follow up" && action.label === "Duplicate")
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
        playWhoosh()
        loadIncidents()

        const needed = totalTicketsRef.current

        if (closedCount >= needed) {
            if (newScore >= 500) {
                await delay(1000)
                setShowEnding(true)
                if (newScore >= 1800) playBell()
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

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-yellow-400 font-mono text-sm font-bold">Score: {score}</span>
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
                            <p className="text-gray-500 text-xs mt-1 italic">Reported by: {incident.reporter}</p>
                            <div className="flex justify-between items-center mt-3">
                                <p className="text-gray-600 text-xs">
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
                                                className="text-xs bg-gray-700 hover:bg-blue-800 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors"
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
                <div className="fixed bottom-6 right-6 bg-gray-800 border border-blue-500 rounded-lg p-6 max-w-md shadow-2xl">
                    <p className="text-blue-400 text-xs font-bold uppercase mb-1">Post-Shift Assessment</p>
                    <p className="text-white text-sm font-semibold mb-1">Incoming situation report.</p>
                    <p className="text-gray-400 text-xs mb-4">Please select the option that best describes your current situation. This is required.</p>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "A", text: "I have not received a response to my email. I sent a follow up. I sent a follow up to the follow up. I have been told they are looping someone in. That was Thursday.", priority: "medium", title: "Email chain unresponsive — follow up to follow up submitted", reporter: "Karen Lindsey, Project Coordinator" },
                            { label: "B", text: "The printer was working this morning. I did not touch the printer. Nobody touched the printer. The printer has decided. We respect the printer's decision.", priority: "low", title: "Printer has entered unknown autonomous state — do not approach", reporter: "Linda Marsh, Office Manager" },
                            { label: "C", text: "There is a meeting on my calendar for 7am. I did not accept this meeting. I do not know who scheduled it. It is now 6:45am on a Saturday. I am on the call.", priority: "high", title: "Unauthorized calendar event — attendee present. Attendee had no choice.", reporter: "Outlook Calendar System (automated)" },
                        ].map(option => (
                            <button
                                key={option.label}
                                onClick={async () => {
                                    await fetch('/api/incidents', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ title: option.title, description: option.text, priority: option.priority, reporter: option.reporter })
                                    })
                                    totalTicketsRef.current = totalTicketsRef.current + 1
                                    loadIncidents()
                                    playWhoosh()
                                    if (option.label === "B") {
                                        setSurveyChoice("PRINTER")
                                    } else {
                                        setSurveyChoice(option.label)
                                    }
                                    setSurveyAnswered(true)
                                    setShowSurvey(false)
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
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full shadow-2xl text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase mb-4">{surveyChoice === "PRINTER" || score >= 1800 ? "PC LOAD LETTER" : score >= 1300 ? "End of Shift. Beginning of Shift." : score >= 1100 ? "You Are the Incident." : score >= 900 ? "The Printer Acknowledges You." : score >= 700 ? "Performance Noted." : "Shift Complete."}</p>
                        <p className="text-yellow-400 font-mono text-2xl font-bold mb-2">{score} pts</p>
                        <p className="text-gray-400 text-xs mb-6">{surveyChoice === "PRINTER" || score >= 1800 ? "On February 19, 1999, three employees of Initech Corporation removed a Samsung SLB-3108H laser printer from the fourth floor and transported it to an adjacent field. The printer was issued a final warning. The printer did not comply. The matter was resolved with a Louisville Slugger. No disciplinary action was taken. The replacement arrived the following Monday. It was the same model. The toner light was already amber." : score >= 1300 ? "There is no end screen. There has never been an end screen. You are still on shift. You have always been on shift. The fluorescent light above your desk has been replaced. The new bulb is the same as the old bulb. Facilities has marked this as resolved." : score >= 1100 ? "All tickets have been resolved. All systems are operational. A new ticket has appeared in the queue. The title is your name. The description is blank. The priority is pending. It has been assigned to the printer. The printer has accepted." : score >= 900 ? "The printer has printed a single page in your honor. The page is blank. This is the highest commendation the printer has ever issued. Facilities has framed it. It is hanging in a hallway that does not appear on the floor plan." : score >= 700 ? "Your shift has concluded. A report has been filed. Someone may read it. They will not act on it." : "Your shift has concluded. A report has been filed to the Runbook Library. It will not be read."}</p>
                        <button onClick={() => window.location.href = "/"} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Return to Dashboard</button>
                    </div>
                </div>
            )}
        </div>
    )
}