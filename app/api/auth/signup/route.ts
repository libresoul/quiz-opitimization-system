import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { createClient } from '@/lib/supabase/server'

const signUpSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  password: z.string()
})

type UserData = z.infer<typeof signUpSchema>

export async function POST(request: NextRequest) {
  const payload: UserData = await request.json()
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

  return NextResponse.json(
    {
      sucess: true,
      message: 'Sign up success',
      userId: data.user?.id,
      token: data.session?.access_token,
      refreshToken: data.session?.refresh_token
    },
    { status: 201 }
  )
}
