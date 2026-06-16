'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import DashboardShell from '@/components/dashboard-shell'

type QuizAnswer = {
  id: number
  text: string | null
  status: 'correct' | 'incorrect' | null
}

type QuizQuestion = {
  id: number
  text: string | null
  score: number | null
  time: number | null
  answers: QuizAnswer[]
}

type QuizDetail = {
  id: number
  title: string | null
  total_time: number | null
  status: 'open' | 'draft' | null
  questions: QuizQuestion[]
}

type QuizDetailResponse =
  | { success: true; data: { quiz: QuizDetail } }
  | { success: false; message: string }

type AnswerSubmitResponse =
  | { success: true; data: QuizAnswer }
  | { success: false; message: string }

export default function QuizDetailPage() {
  const params = useParams<{ id: string }>()
  const quizId = Number(params.id)
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null)

  const loadQuiz = async (activeRef: { current: boolean }) => {
    if (!Number.isInteger(quizId) || quizId <= 0) {
      toast.error('Invalid quiz id')
      return
    }

    const response = await fetch(`/api/quizzes/${quizId}`, {
      credentials: 'include'
    })
    const data = (await response.json()) as QuizDetailResponse

    if (!activeRef.current) return

    if (!response.ok || !data.success) {
      toast.error(data.success ? 'Failed to load quiz' : data.message)
      return
    }

    setQuiz(data.data.quiz)
    const initialAnswers = Object.fromEntries(
      data.data.quiz.questions.flatMap((question) =>
        question.answers.map((answer) => [question.id, answer.text ?? ''])
      )
    )
    setAnswers(initialAnswers)
  }

  useEffect(() => {
    const activeRef = { current: true }

    loadQuiz(activeRef)

    return () => {
      activeRef.current = false
    }
  }, [quizId])

  const handleSaveAnswer = async (questionId: number) => {
    setSavingQuestionId(questionId)
    const response = await fetch(`/api/quizzes/${quizId}/answers`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId,
        text: answers[questionId] ?? ''
      })
    })

    const data = (await response.json()) as AnswerSubmitResponse

    if (!response.ok || !data.success) {
      toast.error(data.success ? 'Failed to save answer' : data.message)
      setSavingQuestionId(null)
      return
    }

    toast.success('Answer saved')
    await loadQuiz({ current: true })
    setSavingQuestionId(null)
  }

  const questions = quiz?.questions ?? []

  return (
    <DashboardShell
      title="Quiz detail"
      description="Review the questions for a quiz and answer them"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quizzes', href: '/dashboard/quizzes' },
        { label: quiz?.title ?? `Quiz ${quizId}` }
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {quiz?.title ?? 'Loading quiz...'}
              </h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {quiz ? 'Question list' : 'Loading question list...'}
              </p>
            </div>
            <Link
              href={`/dashboard/quizzes/${quizId}/optimal?timeLimit=${quiz?.total_time ?? 7}`}
              className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              See optimal set
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Question {index + 1}
                    </p>
                    <h3 className="mt-1 font-medium">{question.text}</h3>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      Score {question.score ?? 0} points · {question.time ?? 0}{' '}
                      min
                    </p>
                  </div>

                  <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    {question.answers.length > 0 ? 'Answered' : 'Required'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Your answer
                    </span>
                    <input
                      type="text"
                      placeholder="Type your response"
                      value={answers[question.id] ?? ''}
                      onChange={(event) =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: event.target.value
                        }))
                      }
                      className="rounded-lg border border-neutral-200 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-800 dark:focus:border-neutral-600"
                    />
                  </label>
                  <button
                    onClick={() => handleSaveAnswer(question.id)}
                    disabled={savingQuestionId === question.id}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
                  >
                    {savingQuestionId === question.id
                      ? 'Saving...'
                      : 'Save answer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold">Quiz summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Questions', String(questions.length)],
                [
                  'Estimated time',
                  quiz?.total_time ? `${quiz.total_time} min` : 'N/A'
                ],
                [
                  'Best target score',
                  String(
                    questions.reduce(
                      (total, question) => total + (question.score ?? 0),
                      0
                    )
                  )
                ],
                [
                  'Answered',
                  `${questions.filter((question) => question.answers.length > 0).length} / ${questions.length}`
                ]
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-neutral-500 dark:text-neutral-400">
                    {label}
                  </dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-2 rounded-full bg-black dark:bg-white"
                style={{
                  width: `${questions.length > 0 ? (questions.filter((question) => question.answers.length > 0).length / questions.length) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </aside>
      </section>
    </DashboardShell>
  )
}
