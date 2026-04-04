'use client'

import { useState, useEffect } from 'react'
import { reviewMap, generateSummary } from '../../lib/reviewResponses'

interface ShiftReport {
    shiftLog: { title: string, priority: string, action: string, points: number }[]
    score: number
    surveyChoice: string | null
    timestamp: string
}

function getPayInfo(score: number): { pay: string, item: string, description: string } {
    if (score >= 1800) return { pay: "$18.00", item: "Samsung SLB-3108H Laser Printer", description: "Refurbished. The toner light is already amber. It is yours now. Congratulations. You have acquired the printer. The printer has acquired you." }
    if (score >= 1300) return { pay: "$13.00", item: "Reserved Parking Spot", description: "The spot is on Floor 3. There is no parking on Floor 3. The printer is there. Your vehicle will not be towed. Your vehicle will not be found." }
    if (score >= 1100) return { pay: "$11.00", item: "Desk Nameplate", description: "It has a typo. The typo is your name. A ticket has been submitted to correct it. The ticket has been marked as Duplicate." }
    if (score >= 900) return { pay: "$9.00", item: "Desk Plant", description: "The plant is plastic. Facilities will water it anyway. Facilities has scheduled the watering. The watering occurs on Tuesdays. It is Wednesday." }
    if (score >= 700) return { pay: "$7.00", item: "Replacement Mouse", description: "It is wired. The cord is 18 inches. Your desk is 24 inches wide. An adapter has been requested. The adapter is on back order." }
    return { pay: "$5.00", item: "Vending Machine Coffee", description: "The vending machine is out of coffee. You have purchased hot water. The hot water is lukewarm. A ticket has been submitted." }
}

export default function RunbookPage() {
    const [report, setReport] = useState<ShiftReport | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('opsdesk-shift-report')
        if (saved) {
            setReport(JSON.parse(saved))
        }
    }, [])

    const priorityColor: Record<string, string> = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-orange-400',
        critical: 'text-red-400'
    }

    const actionColor: Record<string, string> = {
        'Duplicate': 'text-blue-400',
        'User Error': 'text-yellow-400',
        'Escalate': 'text-orange-400',
        'Unresolvable': 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">Runbook Library</p>
                </div>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    ← Dashboard
                </a>
            </header>
            <main className="p-6 max-w-4xl mx-auto">
                {!report ? (
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Runbook Library</h2>
                        <p className="text-gray-500 text-sm">No documents on file. Complete a shift to generate a report.</p>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Shift Log</h2>
                            <div className="text-right">
                                <p className="text-yellow-400 font-mono text-lg font-bold">{report.score} pts</p>
                                <p className="text-gray-600 text-xs">{new Date(report.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-6">
                            {report.shiftLog.map((entry, i) => (
                                <div key={i} className="bg-gray-800 border border-gray-700 rounded px-4 py-3 flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold uppercase ${actionColor[entry.action] || 'text-gray-400'}`}>{entry.action}</span>
                                            <span className="text-gray-600 text-xs">|</span>
                                            <span className={`text-xs font-bold uppercase ${priorityColor[entry.priority] || 'text-gray-400'}`}>{entry.priority}</span>
                                        </div>
                                        <p className="text-white text-sm font-medium truncate">{entry.title}</p>
                                        <p className="text-gray-400 text-xs mt-1">{reviewMap[entry.title]?.[entry.action] ?? "No corresponding review entry. This is itself an incident."}</p>
                                    </div>
                                    <span className={`font-mono text-sm font-bold shrink-0 ${entry.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>{entry.points >= 0 ? '+' : ''}{entry.points}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded px-4 py-3 mb-6">
                            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Summary</p>
                            <p className="text-gray-300 text-xs">{generateSummary(report.shiftLog, report.score)}</p>
                        </div>
                        <div className="bg-gray-800 border border-yellow-700 rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-yellow-400 text-xs font-bold uppercase mb-1">Pay Stub</p>
                                    <p className="text-gray-600 text-xs">OpsDesk Inc. — Payroll Department</p>
                                </div>
                                <p className="text-yellow-400 font-mono text-2xl font-bold">{getPayInfo(report.score).pay}</p>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-1">Company Store Purchase</p>
                                <p className="text-white text-sm font-semibold mb-2">{getPayInfo(report.score).item}</p>
                                <p className="text-gray-400 text-xs leading-relaxed">{getPayInfo(report.score).description}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button onClick={() => {
                                localStorage.removeItem('opsdesk-shift-report')
                                window.location.href = "/"
                            }} className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold px-8 py-3 rounded transition-colors">Clock Out</button>
                            <p className="text-gray-700 text-xs mt-3">This document was generated automatically. It has been filed. It will not be reviewed. It is permanent.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}