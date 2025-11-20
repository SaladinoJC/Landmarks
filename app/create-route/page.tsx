'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/context/user-context'
import MapComponent from '@/components/map-component'
import LandmarksList from '@/components/landmarks-list'
import { v4 as uuidv4 } from 'uuid'

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

export default function CreateRoute() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [routeName, setRouteName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const { username, userId } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!username) {
      router.push('/')
    }
  }, [username, router])

  const addLandmark = (lat: number, lng: number) => {
    const newLandmark: Landmark = {
      id: uuidv4(),
      name: `Landmark ${landmarks.length + 1}`,
      description: '',
      lat,
      lng,
      order: landmarks.length,
    }
    setLandmarks([...landmarks, newLandmark])
  }

  const updateLandmark = (id: string, updates: Partial<Landmark>) => {
    setLandmarks(landmarks.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const removeLandmark = (id: string) => {
    const updated = landmarks.filter(l => l.id !== id)
    setLandmarks(updated.map((l, idx) => ({ ...l, order: idx })))
  }

  const reorderLandmarks = (newOrder: Landmark[]) => {
    setLandmarks(newOrder.map((l, idx) => ({ ...l, order: idx })))
  }

  const saveRoute = async () => {
    if (!routeName.trim()) {
      setError('Please enter a route name')
      return
    }

    if (landmarks.length < 2) {
      setError('Please add at least 2 landmarks')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const route = {
        id: uuidv4(),
        name: routeName,
        author: username,
        authorId: userId,
        landmarks,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      })

      if (!response.ok) throw new Error('Failed to save route')

      const { routeId } = await response.json()
      router.push(`/view-route/${routeId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save route')
      setIsSaving(false)
    }
  }

  if (!username) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-text-primary">Create New Route</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-lg">
              <MapComponent landmarks={landmarks} onMapClick={addLandmark} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Route Details */}
            <div className="bg-surface rounded-2xl border-2 border-border p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Route Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g., Downtown Walking Tour"
                    maxLength={50}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-text-primary mb-2">
                    Landmarks Added: {landmarks.length}
                  </p>
                  <p className="text-xs text-text-secondary">Click on the map to add new landmarks</p>
                </div>

                {error && <p className="text-error text-sm bg-error/10 p-2 rounded">{error}</p>}

                <button
                  onClick={saveRoute}
                  disabled={isSaving || landmarks.length < 2}
                  className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Route'}
                </button>
              </div>
            </div>

            {/* Landmarks List */}
            <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden">
              <LandmarksList
                landmarks={landmarks}
                onUpdateLandmark={updateLandmark}
                onRemoveLandmark={removeLandmark}
                onReorder={reorderLandmarks}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
