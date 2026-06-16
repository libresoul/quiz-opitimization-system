import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { createClient } from '@/lib/supabase/server'
import { SignUpRequest, signUpSchema } from '@/types/api'

export async function POST(request: NextRequest) {
  const payload: SignUpRequest = await request.json()
  const validated = signUpSchema.safeParse(payload)

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

  const { fullName, email, password } = validated.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: fullName,
        email,
        role: 'user'
      }
    }
  })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to sign up',
        error: error.message
      },
      { status: 500 }
    )
  }

  const response = NextResponse.json(
    {
      success: true,
      message: 'Sign up success',
      data: data.user
    },
    { status: 201 }
  )

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
