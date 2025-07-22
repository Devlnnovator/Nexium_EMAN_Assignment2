'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unknown error')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-orange-400">
      <div className="bg-white/90 rounded-xl shadow-lg p-8 max-w-xl w-full mt-10">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">Blog Summariser</h1>
        <p className="text-orange-600 text-center mb-6 font-medium">Summarise any blog and get an instant Urdu translation!</p>
        <div className="flex gap-2 mb-4">
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter blog URL..."
            className="flex-1 border-blue-400 focus:border-orange-400 focus:ring-orange-400 rounded-l-lg"
          />
          <Button
            className="rounded-r-lg bg-blue-600 hover:bg-orange-500 text-white font-bold px-6 transition-colors duration-200"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Summarising...' : 'Summarise'}
          </Button>
        </div>
        {error && (
          <div className="mt-4 text-red-600 font-bold text-center bg-orange-100 rounded p-2 border border-orange-300">Error: {error}</div>
        )}
        {result && !error && (
          <div className="mt-8">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow mb-6">
              <h2 className="font-bold text-blue-700 text-lg mb-2">Summary:</h2>
              <p className="text-gray-800 leading-relaxed">{result.summary}</p>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow">
              <h2 className="font-bold text-orange-600 text-lg mb-2">Urdu Translation:</h2>
              <p className="text-gray-800 leading-relaxed">{result.translated}</p>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-10 text-white/80 text-sm">&copy; {new Date().getFullYear()} Blog Summariser | Powered by Next.js</footer>
    </div>
  )
}
