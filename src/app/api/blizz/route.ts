// /home/archbtw/code/gearcheck/src/app/api/blizz/route.ts

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const clientId = process.env.BLIZZARD_CLIENT_ID
  const clientSecret = process.env.BLIZZARD_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Missing Blizzard API credentials' },
      { status: 500 },
    )
  }

  try {
    const tokenResponse = await fetch('https://us.battle.net/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to fetch Blizzard API token')
    }

    const tokenData = await tokenResponse.json()
    return NextResponse.json(tokenData)
  } catch (error) {
    console.error('Error fetching Blizzard API token:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Blizzard API token' },
      { status: 500 },
    )
  }
}

// If you need to handle POST requests as well, you can add this:
export async function POST(request: Request) {
  // Handle POST requests here if needed
  return NextResponse.json(
    { message: 'POST method not implemented' },
    { status: 501 },
  )
}
