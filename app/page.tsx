export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-400">OpsDesk</h1>
        <p className="text-gray-400 text-sm">IT Operations Dashboard</p>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-2 gap-6">

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Incident Log</h2>
            <p className="text-gray-400 text-sm">Track and manage active incidents</p>
            <p className="text-3xl font-bold text-white mt-4">0 Open</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Runbook Library</h2>
            <p className="text-gray-400 text-sm">Operational procedures and guides</p>
            <p className="text-3xl font-bold text-white mt-4">0 Docs</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-green-400 mb-2">System Health</h2>
            <p className="text-gray-400 text-sm">Live service status board</p>
            <p className="text-3xl font-bold text-green-400 mt-4">All Clear</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Metrics</h2>
            <p className="text-gray-400 text-sm">Incident trends and response times</p>
            <p className="text-3xl font-bold text-white mt-4">Coming Soon</p>
          </div>

        </div>
      </main>
    </div>
  );
}