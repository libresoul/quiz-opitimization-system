import DashboardShell from '@/components/dashboard-shell'
import QuizzesList from '@/components/quizzes-list'

export default function QuizzesPage() {
  return (
    <DashboardShell
      title="Quizzes"
      description="Browse the available quizzes and jump into a detail view to answer questions."
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Quizzes' }
      ]}
    >
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Available quizzes</h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Minimal listing UI with quiz metadata and action links.
            </p>
          </div>
        </div>

        <QuizzesList />
      </section>
    </DashboardShell>
  )
}
