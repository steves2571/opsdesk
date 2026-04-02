'use client'

import { useState } from 'react'

export default function IncidentsPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')

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
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
                <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
            </header>
            <main className="p-6 max-w-2xl">
                <h2 className="text-xl font-semibold text-white mb-6">Log New Incident</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            </main>
        </div>
    )
}