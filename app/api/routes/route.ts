import { NextRequest, NextResponse } from 'next/server'
import { saveRoute } from '@/lib/routes-storage'

export async function POST(request: NextRequest) {
  try {
    const route = await request.json()

    // Validate route data
    if (!route.id || !route.name || !route.author || !Array.isArray(route.landmarks)) {
      return NextResponse.json(
        { error: 'Invalid route data' },
        { status: 400 }
      )
    }

    if (route.landmarks.length < 2) {
      return NextResponse.json(
        { error: 'Route must have at least 2 landmarks' },
        { status: 400 }
      )
    }

    const saved = await saveRoute(route)
    return NextResponse.json({ routeId: saved.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating route:', error)
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    )
  }
}
