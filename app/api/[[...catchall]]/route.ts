import { NextResponse } from 'next/server'

function handleNotFound() {
  return NextResponse.json(
    {
      success: false,
      message: 'The requested route does not exist'
    },
    { status: 404 }
  )
}

export async function GET() {
  return handleNotFound()
}
export async function POST() {
  return handleNotFound()
}
export async function PUT() {
  return handleNotFound()
}
export async function PATCH() {
  return handleNotFound()
}
export async function DELETE() {
  return handleNotFound()
}
