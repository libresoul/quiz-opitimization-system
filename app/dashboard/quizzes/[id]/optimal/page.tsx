'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import DashboardShell from '@/components/dashboard-shell'
import type { OptimalSetResult } from '@/types/api'

type OptimalSetResponse =
  | { success: true; data: OptimalSetResult }
  | { success: false; message: string }

export default function OptimalSetPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const quizId = Number(params.id)
  const [draftTimeLimit, setDraftTimeLimit] = useState(
    searchParams.get('timeLimit') ?? '7'
  )
  const [timeLimit, setTimeLimit] = useState(
    searchParams.get('timeLimit') ?? '7'
  )
  const [result, setResult] = useState<OptimalSetResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    async function loadOptimalSet() {
      setLoading(true)
      const response = await fetch(
        `/api/quizzes/${quizId}/optimal-set?timeLimit=${encodeURIComponent(timeLimit)}`,
        { credentials: 'include' }
      )
      const data = (await response.json()) as OptimalSetResponse

      if (!active) return

      if (!response.ok || !data.success) {
        toast.error(data.success ? 'Failed to load optimal set' : data.message)
        setResult(null)
        setLoading(false)
        return
      }

      setResult(data.data)
      setLoading(false)
    }

    loadOptimalSet()

    return () => {
      active = false
    }
  }, [quizId, timeLimit])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const nextTimeLimit = (
        event.currentTarget.elements.namedItem('timeLimit') as HTMLInputElement
      ).value
      setTimeLimit(nextTimeLimit)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedQuestions = result?.selected_questions ?? []
  const availableQuestions = result?.available_questions ?? []

  return (
    <DashboardShell
      title="Optimal question set"
      description="Use dynamic programming to find the best scoring subset within a time limit."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quizzes', href: '/dashboard/quizzes' },
        { label: result?.quiz.title ?? `Quiz ${quizId}` },
        { label: 'Optimal set' }
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recommended selection</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {loading
                  ? 'Calculating the optimal set...'
                  : `Time limit: ${result?.time_limit ?? timeLimit} minutes.`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Time limit
                </span>
                <input
                  name="timeLimit"
                  type="number"
                  min={1}
                  value={draftTimeLimit}
                  onChange={(e) => setDraftTimeLimit(e.target.value)}
                  className="w-28 rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-400 dark:border-neutral-800 dark:focus:border-neutral-600"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black"
              >
                {submitting ? 'Updating...' : 'Recalculate'}
              </button>
            </form>
          </div>

          <div className="mt-5 space-y-3">
            {selectedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Pick {index + 1}
                  </p>
                  <h3 className="mt-1 font-medium">{question.text}</h3>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {question.score ?? 0} points · {question.time ?? 0} min
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold dark:bg-neutral-800">
                  Selected
                </span>
              </div>
            ))}
            {!loading && selectedQuestions.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No questions fit within the chosen time limit.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold">DP summary</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Time limit', `${result?.time_limit ?? timeLimit} min`],
                ['Best score', String(result?.total_score ?? 0)],
                ['Questions chosen', String(selectedQuestions.length)]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <p className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold">Other candidates</h2>
            <div className="mt-4 space-y-3">
              {availableQuestions
                .filter(
                  (question) =>
                    !selectedQuestions.some((selected) => selected.id === question.id)
                )
                .map((question) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
                  >
                    <h3 className="font-medium">{question.text}</h3>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                      {question.score ?? 0} points · {question.time ?? 0} min
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
