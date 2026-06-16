import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  optimalSetQuerySchema,
  type OptimalSetResult,
  type OptimalQuestionRow
} from '@/types/api'
import { calculateOptimalSet } from '@/lib/optimal-set'

export async function GET(
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

  const query = Object.fromEntries(request.nextUrl.searchParams)
  const validated = optimalSetQuerySchema.safeParse(query)

  if (!validated.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request data'
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

  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title, total_time, status')
    .eq('id', quizId)
    .maybeSingle()

  if (quizError) {
    return NextResponse.json(
      { success: false, message: quizError.message },
      { status: 500 }
    )
  }

  if (!quiz) {
    return NextResponse.json(
      { success: false, message: 'Quiz not found' },
      { status: 404 }
    )
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, text, score, time')
    .eq('quiz_id', quizId)
    .order('id', { ascending: true })

  if (questionsError) {
    return NextResponse.json(
      { success: false, message: questionsError.message },
      { status: 500 }
    )
  }

  const availableQuestions = (questions ?? []) as OptimalQuestionRow[]
  const result = calculateOptimalSet(
    availableQuestions,
    validated.data.timeLimit
  )

  const payload: OptimalSetResult = {
    quiz,
    time_limit: validated.data.timeLimit,
    total_score: result.total_score,
    total_time: result.total_time,
    remaining_time: result.remaining_time,
    selected_questions: result.selected_questions,
    available_questions: availableQuestions
  }

  return NextResponse.json({
    success: true,
    data: payload
  })
}
