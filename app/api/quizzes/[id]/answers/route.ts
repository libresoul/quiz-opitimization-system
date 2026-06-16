import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { createClient } from '@/lib/supabase/server'
import { submitAnswerSchema } from '@/types/api'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const quizId = Number(id)

  if (!Number.isInteger(quizId) || quizId <= 0) {
    return NextResponse.json(
      { success: false, message: 'Invalid quiz id' },
      { status: 400 }
    )
  }

  const payload = await request.json()
  const validated = submitAnswerSchema.safeParse(payload)

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

  const supabase = await createClient()
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('id, quiz_id')
    .eq('id', validated.data.questionId)
    .eq('quiz_id', quizId)
    .maybeSingle()

  if (questionError) {
    return NextResponse.json(
      { success: false, message: questionError.message },
      { status: 500 }
    )
  }

  if (!question) {
    return NextResponse.json(
      { success: false, message: 'Question not found for this quiz' },
      { status: 404 }
    )
  }

  const { data, error } = await supabase
    .from('answers')
    .insert({
      user_id: user.id,
      question_id: question.id,
      text: validated.data.text,
      status: validated.data.status ?? null
    })
    .select('id, user_id, question_id, text, status, created_at')
    .single()

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      data
    },
    { status: 201 }
  )
}
