'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type QuizSummary = {
  id: number
  title: string | null
  total_time: number | null
  status: string | null
  question_count: number
}

type QuizzesResponse =
  | {
      success: true
      data: {
        quizzes: QuizSummary[]
      }
    }
  | {
      success: false
      message: string
    }

export default function QuizzesList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadQuizzes() {
      setLoading(true)
      const response = await fetch('/api/quizzes', { credentials: 'include' })
      const data = (await response.json()) as QuizzesResponse

      if (!active) return

      if (!response.ok || !data.success) {
        toast.error(data.success ? 'Failed to load quizzes' : data.message)
        setQuizzes([])
        setLoading(false)
        return
      }

      setQuizzes(data.data.quizzes)
      setLoading(false)
    }

    loadQuizzes()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading quizzes...</p>
  }

  return (
    <div className="mt-5 grid gap-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">{quiz.title}</h3>
                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  {quiz.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span>{quiz.question_count} questions</span>
                <span>{quiz.total_time ? `${quiz.total_time} min` : 'N/A'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/dashboard/quizzes/${quiz.id}`}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
