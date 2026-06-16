import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  const response = NextResponse.json({
    success: true,
    message: 'Logout success'
  })

  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')

  return response
}
