import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Navbar />

        <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-16">
          <section className="mx-auto grid max-w-4xl gap-10 text-center">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                Quiz Optimization System
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Attempt quizzes, track answers, and get the best set of
                questions for your time limit.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                Just what you need to be better of yourself. Answer optimial
                questions under the given time maximizing your score
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="/signup"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-black"
                >
                  Get started
                </a>
                <a
                  href="/dashboard"
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                  Open dashboard
                </a>
              </div>

              <dl className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
                {[
                  ['Quizzes', 'Open and draft'],
                  ['Questions', 'Score and time based'],
                  ['Optimal set', 'Get optimal questions']
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
