'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type QuizStats = {
  available_quizzes: number
  questions_total: number
  open_quizzes: number
}

type DashboardResponse =
  | {
    success: true
    data: {
      stats: QuizStats
    }
  }
  | {
    success: false
    message: string
  }

const quickLinks = [
  {
    title: 'Browse quizzes',
    description:
      'Jump into the available quizzes and inspect the question sets.',
    href: '/dashboard/quizzes'
  },
  {
    title: 'View a quiz',
    description: 'Open a quiz detail page with questions and answer inputs.',
    href: '/dashboard/quizzes/1'
  }
]

export default function DashboardSummary() {
  const [stats, setStats] = useState<QuizStats>({
    available_quizzes: 0,
    questions_total: 0,
    open_quizzes: 0
  })

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      const response = await fetch('/api/quizzes', { credentials: 'include' })
      const data = (await response.json()) as DashboardResponse

      if (!active) return

      if (!response.ok || !data.success) {
        toast.error(data.success ? 'Failed to load dashboard' : data.message)
        return
      }

      setStats(data.data.stats)
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const statItems = [
    { label: 'Available quizzes', value: stats.available_quizzes.toString() },
    { label: 'Questions total', value: stats.questions_total.toString() },
    { label: 'Open quizzes', value: stats.open_quizzes.toString() }
  ]

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Workspace overview</h2>
            </div>
            <Link
              href="/dashboard/quizzes"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              Open quizzes
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {[
              'Choose a quiz from the list',
              'Review the questions in a focused detail view',
              'Use the optimal-set page to compare time vs score'
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold dark:bg-neutral-800">
                  {index + 1}
                </span>
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/60"
              >
                <p className="font-medium">{link.title}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
