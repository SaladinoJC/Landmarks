'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchRouteForm from '@/components/search-route-form'

export default function ViewRoute() {
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const router = useRouter()

  const handleSearchRoute = (routeId: string) => {
    router.push(`/view-route/${routeId}`)
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
            <h1 className="text-2xl font-bold text-text-primary">View Route</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchRouteForm onSearch={handleSearchRoute} />
      </div>
    </main>
  )
}
