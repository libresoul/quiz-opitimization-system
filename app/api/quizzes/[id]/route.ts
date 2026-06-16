import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { QuizDetailRow } from '@/types/api'

export async function GET(
  _request: NextRequest,
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

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select(`
      id,
      title,
      total_time,
      status,
      questions (
        id,
        text,
        score,
        time,
        answers (
          id,
          text,
          status
        )
      )
    `)
    .eq('id', quizId)
    .maybeSingle()

  const detail = quiz as QuizDetailRow | null

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    )
  }

  if (!detail) {
    return NextResponse.json(
      { success: false, message: 'Quiz not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      quiz: detail
    }
  })
}
