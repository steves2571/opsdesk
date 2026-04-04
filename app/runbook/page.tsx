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
    if (score >= 2500) return { pay: "$26.00", item: "A Working Laser Printer", description: "It prints. It does not have opinions. The toner light is green. This has never happened before. Facilities has no record of this device. It is yours. Do not tell Linda." }
    if (score >= 1900) return { pay: "$19.00", item: "Swingline 747 Red Stapler", description: "It was on a desk on the fourth floor. The desk has been relocated. The stapler was not included in the relocation. It has been reassigned to you. Do not lend it. It will not be returned. This is the last one. Milton knows." }
    if (score >= 1600) return { pay: "$16.00", item: "Reserved Parking Spot", description: "The spot is on Floor 3. There is no parking on Floor 3. The printer is there. Your vehicle will not be towed. Your vehicle will not be found." }
    if (score >= 1300) return { pay: "$13.00", item: "Desk Nameplate", description: "It has a typo. The typo is your name. A ticket has been submitted to correct it. The ticket has been marked as Duplicate." }
    if (score >= 1000) return { pay: "$10.00", item: "Desk Plant", description: "The plant is plastic. Facilities will water it anyway. Facilities has scheduled the watering. The watering occurs on Tuesdays. It is Wednesday." }
    if (score >= 700) return { pay: "$7.00", item: "Replacement Mouse", description: "It is wired. The cord is 18 inches. Your desk is 24 inches wide. An adapter has been requested. The adapter is on back order." }
    return { pay: "$5.00", item: "Vending Machine Coffee", description: "The vending machine is out of coffee. You have purchased hot water. The hot water is lukewarm. A ticket has been submitted." }
}

export default function RunbookPage() {
    const [report, setReport] = useState<ShiftReport | null>(null)
    const [showGuide, setShowGuide] = useState(false)
    const [showReport, setShowReport] = useState(false)

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
                <div className="flex justify-center mb-8">
                    <svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                        <rect x="20" y="35" width="160" height="60" rx="3" fill="#1a1a2e" stroke="#4a5568" strokeWidth="2" />
                        <rect x="30" y="42" width="140" height="14" rx="2" fill="#0d0d1a" stroke="#2d3748" strokeWidth="1" />
                        <line x1="35" y1="47" x2="160" y2="47" stroke="#1e40af" strokeWidth="0.7" opacity="0.3" />
                        <line x1="35" y1="50" x2="145" y2="50" stroke="#1e40af" strokeWidth="0.5" opacity="0.2" />
                        <line x1="35" y1="53" x2="155" y2="53" stroke="#1e40af" strokeWidth="0.5" opacity="0.2" />
                        <rect x="45" y="10" width="110" height="28" rx="2" fill="#0d0d1a" stroke="#4a5568" strokeWidth="1.5" />
                        <line x1="52" y1="18" x2="148" y2="18" stroke="#2d3748" strokeWidth="0.7" />
                        <line x1="52" y1="23" x2="148" y2="23" stroke="#2d3748" strokeWidth="0.7" />
                        <line x1="52" y1="28" x2="130" y2="28" stroke="#2d3748" strokeWidth="0.7" />
                        <line x1="52" y1="33" x2="140" y2="33" stroke="#2d3748" strokeWidth="0.5" opacity="0.3" />
                        <rect x="45" y="92" width="110" height="20" rx="2" fill="#0d0d1a" stroke="#4a5568" strokeWidth="1.5" />
                        <line x1="52" y1="98" x2="148" y2="98" stroke="#2d3748" strokeWidth="0.4" />
                        <line x1="52" y1="101" x2="148" y2="101" stroke="#2d3748" strokeWidth="0.4" />
                        <line x1="52" y1="104" x2="148" y2="104" stroke="#2d3748" strokeWidth="0.4" />
                        <line x1="52" y1="107" x2="148" y2="107" stroke="#2d3748" strokeWidth="0.4" />
                        <rect x="140" y="62" width="32" height="10" rx="1.5" fill="#0d0d1a" stroke="#2d3748" strokeWidth="0.7" />
                        <rect x="144" y="65" width="7" height="4" rx="1" fill="#1a1a2e" stroke="#4a5568" strokeWidth="0.5" />
                        <rect x="154" y="65" width="7" height="4" rx="1" fill="#1a1a2e" stroke="#4a5568" strokeWidth="0.5" />
                        <rect x="164" y="65" width="4" height="4" rx="1" fill="#1a1a2e" stroke="#4a5568" strokeWidth="0.5" />
                        <circle cx="32" cy="72" r="4" fill="#0d0d1a" stroke="#4a5568" strokeWidth="0.7" />
                        <circle cx="32" cy="72" r="1.5" fill="#d97706">
                            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <line x1="10" y1="35" x2="10" y2="95" stroke="#4a5568" strokeWidth="0.7" opacity="0.3" />
                        <line x1="190" y1="35" x2="190" y2="95" stroke="#4a5568" strokeWidth="0.7" opacity="0.3" />
                        <line x1="0" y1="65" x2="20" y2="65" stroke="#1e40af" strokeWidth="0.4" opacity="0.15" />
                        <line x1="180" y1="65" x2="200" y2="65" stroke="#1e40af" strokeWidth="0.4" opacity="0.15" />
                        <text x="100" y="118" textAnchor="middle" fill="#2d3748" fontSize="7" fontFamily="monospace">SLB-3108H</text>
                    </svg>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Runbook Library</h2>
                    <p className="text-gray-600 text-xs">{report ? '2 Docs' : '1 Doc'}</p>
                </div>

                <div className="space-y-3 mb-6">
                    <div
                        onClick={() => setShowGuide(!showGuide)}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white text-sm font-semibold">NOC Operations Quick Reference Guide</p>
                                <p className="text-gray-500 text-xs">OPS-QRG-001 | Rev. 14 | Laminated Copy — Console 3</p>
                            </div>
                            <span className="text-gray-500 text-xs">{showGuide ? '▼' : '▶'}</span>
                        </div>
                    </div>

                    {showGuide && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
                            <div>
                                <p className="text-blue-400 text-xs font-bold uppercase mb-3">Severity Levels</p>
                                <div className="space-y-2">
                                    <div className="border-l-2 border-red-900 pl-3">
                                        <p className="text-red-400 text-xs font-bold">CRITICAL</p>
                                        <p className="text-gray-400 text-xs">Production systems are down. Multiple users affected. Someone has already emailed the CEO. The CEO has replied-all. Do not reply-all.</p>
                                    </div>
                                    <div className="border-l-2 border-orange-900 pl-3">
                                        <p className="text-orange-400 text-xs font-bold">HIGH</p>
                                        <p className="text-gray-400 text-xs">Service degradation detected. A bridge call has been initiated. The bridge call has 40 participants. Two of them are speaking. Neither is relevant.</p>
                                    </div>
                                    <div className="border-l-2 border-yellow-900 pl-3">
                                        <p className="text-yellow-400 text-xs font-bold">MEDIUM</p>
                                        <p className="text-gray-400 text-xs">A single user is affected. The user is persistent. The user has submitted multiple tickets. The user is not wrong. The user will not stop.</p>
                                    </div>
                                    <div className="border-l-2 border-green-900 pl-3">
                                        <p className="text-green-400 text-xs font-bold">LOW</p>
                                        <p className="text-gray-400 text-xs">No immediate impact. The request has been waiting. The request will continue to wait. A follow-up has been scheduled. The follow-up will also wait.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-blue-400 text-xs font-bold uppercase mb-3">Resolution Categories</p>
                                <div className="space-y-2">
                                    <div className="border-l-2 border-blue-800 pl-3">
                                        <p className="text-blue-400 text-xs font-bold">DUPLICATE</p>
                                        <p className="text-gray-400 text-xs">The incident has been previously reported. Consolidates the queue. Does not resolve the issue. The issue remains. The queue is shorter. This is considered progress.</p>
                                    </div>
                                    <div className="border-l-2 border-yellow-800 pl-3">
                                        <p className="text-yellow-400 text-xs font-bold">USER ERROR</p>
                                        <p className="text-gray-400 text-xs">The root cause is the person who submitted the ticket. This is more common than documentation suggests. Do not communicate this finding to the user. This is policy.</p>
                                    </div>
                                    <div className="border-l-2 border-orange-800 pl-3">
                                        <p className="text-orange-400 text-xs font-bold">ESCALATE</p>
                                        <p className="text-gray-400 text-xs">The incident exceeds your authorization, expertise, or willingness. Route to Tier 2. Tier 2 will acknowledge receipt within 4 hours. Tier 2 will request additional context. The additional context is the original ticket.</p>
                                    </div>
                                    <div className="border-l-2 border-red-800 pl-3">
                                        <p className="text-red-400 text-xs font-bold">UNRESOLVABLE</p>
                                        <p className="text-gray-400 text-xs">The incident cannot be fixed. The system is functioning as designed. The design is the problem. The problem is permanent. This is the most honest resolution. It is rarely selected.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-blue-400 text-xs font-bold uppercase mb-3">Known Issues</p>
                                <div className="space-y-2">
                                    <div className="border-l-2 border-gray-600 pl-3">
                                        <p className="text-white text-xs font-bold">Printer, Floor 3</p>
                                        <p className="text-gray-400 text-xs">Status: Ongoing. Do not attempt repair. Do not dispatch technician. The toner light is amber. It has been amber. The printer is not broken. The printer is functioning as the printer has decided to function.</p>
                                    </div>
                                    <div className="border-l-2 border-gray-600 pl-3">
                                        <p className="text-white text-xs font-bold">VP Workstation, Marketing</p>
                                        <p className="text-gray-400 text-xs">Status: Recurring. Root cause: 47 Chrome tabs. Root cause has not been communicated to the VP. It will not be communicated. Escalate or document as User Error. The VP has the CEO's phone number. Use discretion.</p>
                                    </div>
                                    <div className="border-l-2 border-gray-600 pl-3">
                                        <p className="text-white text-xs font-bold">Ticketing System</p>
                                        <p className="text-gray-400 text-xs">Status: Intermittent. During outages, tickets about the outage will be submitted through the system that is experiencing the outage. Do not attempt to resolve this recursion. Mark as Duplicate and move on.</p>
                                    </div>
                                    <div className="border-l-2 border-gray-600 pl-3">
                                        <p className="text-white text-xs font-bold">All-Hands Meeting</p>
                                        <p className="text-gray-400 text-xs">Status: Quarterly. There is no Zoom link. There has never been a Zoom link. Requests for a Zoom link should be classified as User Error. The Joy Fund has been discontinued. The slideshow will mention ping pong.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-blue-400 text-xs font-bold uppercase mb-3">Walk-Up Protocol</p>
                                <div className="border-l-2 border-yellow-800 pl-3">
                                    <p className="text-gray-400 text-xs">A user will bypass the ticketing system and appear at your desk. This is not a sanctioned workflow. The user is aware of this. The user does not care. Ask if they have submitted a ticket. They have not. Direct them to the ticketing system. They will submit a ticket. The ticket will be about being asked to submit a ticket. If the user is the Office Manager, she is already aware of the process. She has opinions about the process. A ticket will be submitted regardless.</p>
                                </div>
                            </div>

                            <p className="text-gray-700 text-xs">This document is reviewed annually. The review has been postponed. The laminated copy on Console 3 has coffee stains from 2019. They are part of the document now.</p>
                        </div>
                    )}

                    {report && (
                        <>
                            <div
                                onClick={() => setShowReport(!showReport)}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white text-sm font-semibold">Shift Performance Review</p>
                                        <p className="text-gray-500 text-xs">{new Date(report.timestamp).toLocaleString()} | {report.score} pts</p>
                                    </div>
                                    <span className="text-gray-500 text-xs">{showReport ? '▼' : '▶'}</span>
                                </div>
                            </div>

                            {showReport && (
                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                                    <div className="space-y-2 mb-6">
                                        {report.shiftLog.map((entry, i) => (
                                            <div key={i} className="bg-gray-900 border border-gray-700 rounded px-4 py-3 flex items-start justify-between gap-4">
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
                                    <div className="bg-gray-900 border border-gray-700 rounded px-4 py-3 mb-6">
                                        <p className="text-gray-500 text-xs font-bold uppercase mb-1">Summary</p>
                                        <p className="text-gray-300 text-xs">{generateSummary(report.shiftLog, report.score)}</p>
                                    </div>
                                    <div className="bg-gray-900 border border-yellow-700 rounded-lg p-6">
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
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="text-center">
                    <button onClick={() => window.location.href = "/"} className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold px-8 py-3 rounded transition-colors">Clock Out</button>
                    <p className="text-gray-700 text-xs mt-3">Filed. Permanent. Unread.</p>
                </div>
            </main>
        </div>
    )
}