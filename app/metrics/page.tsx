'use client'

import { useState, useEffect } from 'react'

interface ShiftReport {
    shiftLog: { title: string, priority: string, action: string, points: number }[]
    score: number
    surveyChoice: string | null
    timestamp: string
}

function getPayAmount(score: number): string {
    if (score >= 2500) return "$26.00"
    if (score >= 1900) return "$19.00"
    if (score >= 1600) return "$16.00"
    if (score >= 1300) return "$13.00"
    if (score >= 1000) return "$10.00"
    if (score >= 700) return "$7.00"
    return "$5.00"
}

function getPayNumber(score: number): number {
    if (score >= 2500) return 26
    if (score >= 1900) return 19
    if (score >= 1600) return 16
    if (score >= 1300) return 13
    if (score >= 1000) return 10
    if (score >= 700) return 7
    return 5
}

export default function MetricsPage() {
    const [career, setCareer] = useState<ShiftReport[]>([])

    useEffect(() => {
        const saved = localStorage.getItem('opsdesk-career')
        if (saved) {
            setCareer(JSON.parse(saved))
        }
    }, [])

    const totalShifts = career.length
    const totalTickets = career.reduce((sum, shift) => sum + shift.shiftLog.length, 0)
    const highestScore = career.length > 0 ? Math.max(...career.map(s => s.score)) : 0
    const averageScore = career.length > 0 ? Math.round(career.reduce((sum, s) => sum + s.score, 0) / career.length) : 0
    const totalEarnings = career.reduce((sum, s) => sum + getPayNumber(s.score), 0)

    const allActions = career.flatMap(s => s.shiftLog.map(e => e.action))
    const actionCounts: Record<string, number> = {}
    allActions.forEach(a => { actionCounts[a] = (actionCounts[a] || 0) + 1 })
    const topAction = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]

    const penalties = career.reduce((sum, s) => sum + s.shiftLog.filter(e => e.points < 0).length, 0)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                    <p className="text-gray-400 text-sm">Metrics</p>
                </div>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    ← Dashboard
                </a>
            </header>
            <main className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Career Performance</h2>
                    <p className="text-gray-600 text-xs">Employee File — Confidential</p>
                </div>
                {totalShifts === 0 ? (
                    <p className="text-gray-500 text-sm">No shift data on file. Report for duty to begin generating metrics.</p>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Shifts Completed</p>
                                <p className="text-white font-mono text-3xl font-bold">{totalShifts}</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Career Earnings</p>
                                <p className="text-green-400 font-mono text-3xl font-bold">${totalEarnings}.00</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Highest Score</p>
                                <p className="text-yellow-400 font-mono text-3xl font-bold">{highestScore}</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Average Score</p>
                                <p className="text-blue-400 font-mono text-3xl font-bold">{averageScore}</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Tickets Resolved</p>
                                <p className="text-white font-mono text-3xl font-bold">{totalTickets}</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Preferred Method</p>
                                <p className="text-orange-400 font-mono text-xl font-bold">{topAction ? topAction[0] : 'N/A'}</p>
                                <p className="text-gray-600 text-xs mt-1">{topAction ? topAction[1] + ' times' : ''}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Disciplinary Actions</p>
                                <p className={`font-mono text-3xl font-bold ${penalties > 0 ? 'text-red-400' : 'text-green-400'}`}>{penalties}</p>
                                <p className="text-gray-600 text-xs mt-1">{penalties > 0 ? 'HR has been notified' : 'Clean record'}</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase mb-2">Last Paycheck</p>
                                <p className="text-green-400 font-mono text-3xl font-bold">{getPayAmount(career[career.length - 1].score)}</p>
                                <p className="text-gray-600 text-xs mt-1">Before taxes. After taxes: same.</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
                            <p className="text-gray-500 text-xs font-bold uppercase mb-3">Shift History</p>
                            <div className="space-y-2">
                                {career.map((shift, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-gray-700 pb-2">
                                        <div>
                                            <p className="text-white text-sm">Shift {i + 1}</p>
                                            <p className="text-gray-600 text-xs">{new Date(shift.timestamp).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-yellow-400 font-mono text-sm font-bold">{shift.score} pts</p>
                                            <p className="text-green-400 text-xs">{getPayAmount(shift.score)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 text-xs text-center">This data is being monitored. Performance trends are reviewed quarterly. The review has been postponed indefinitely.</p>
                    </div>
                )}
            </main>
        </div>
    )
}