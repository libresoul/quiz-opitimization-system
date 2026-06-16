import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      id,
      title,
      total_time,
      status,
      questions (
        id
      )
    `
    )
    .order('id', { ascending: true })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: 500 }
    )
  }

  const quizzes = (data ?? []).map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    total_time: quiz.total_time,
    status: quiz.status,
    question_count: quiz.questions?.length ?? 0
  }))

  const stats = {
    available_quizzes: quizzes.length,
    questions_total: quizzes.reduce((total, quiz) => total + quiz.question_count, 0),
    open_quizzes: quizzes.filter((quiz) => quiz.status === 'open').length
  }

  return NextResponse.json({
    success: true,
    data: {
      quizzes,
      stats
    }
  })
}
