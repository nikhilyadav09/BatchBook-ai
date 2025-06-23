import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          BatchBook AI
        </h1>
        <p className="text-gray-600 mb-6">
          Memory Sharing Platform
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Count is {count}
          </button>
          <p className="text-sm text-gray-500">
            🚀 Client is running successfully!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
