import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { createClient } from '@/lib/supabase/server'
import { SignInRequest, signInSchema } from '@/types/api'

export async function POST(request: NextRequest) {
  const payload: SignInRequest = await request.json()
  const validated = signInSchema.safeParse(payload)

  if (!validated.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request data',
        error: z.flattenError(validated.error)
      },
      { status: 400 }
    )
  }

  const { email, password } = validated.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to sign in',
        error: error.message
      },
      { status: 500 }
    )
  }

  const response = NextResponse.json({
    success: true,
    message: 'Sign in success',
    data: data.user
  })

  if (data.session) {
    response.cookies.set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in
    })

    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5
    })
  }

  return response
}
