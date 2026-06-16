'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ReactNode } from 'react'

type DashboardShellProps = {
  title: string
  description: string
  children: ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export default function DashboardShell({
  title,
  description,
  children,
  breadcrumbs = []
}: DashboardShellProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      router.replace('/login')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-neutral-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-sm font-semibold tracking-tight hover:opacity-80"
              >
                Quiz Optimization
              </Link>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                {breadcrumbs.map((crumb, index) => (
                  <span
                    key={`${crumb.label}-${index}`}
                    className="flex items-center gap-2"
                  >
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-neutral-950 dark:hover:text-neutral-50"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-neutral-950 dark:text-neutral-50">
                        {crumb.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/dashboard/quizzes"
                className="rounded-lg border border-neutral-200 px-3 py-2 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
              >
                Quizzes
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg border border-neutral-200 px-3 py-2 hover:bg-neutral-100 disabled:opacity-60 dark:border-neutral-800 dark:hover:bg-neutral-800"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          </div>
        </header>

        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  )
}
