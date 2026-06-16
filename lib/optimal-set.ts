import type { OptimalQuestionRow } from '@/types/api'

export function calculateOptimalSet(
  questions: OptimalQuestionRow[],
  timeLimit: number
) {
  const capacity = Math.max(0, Math.floor(timeLimit))
  const items = questions.map((question) => ({
    ...question,
    time: Math.max(0, Math.floor(question.time ?? 0)),
    score: question.score ?? 0
  }))

  const dp = Array.from({ length: items.length + 1 }, () =>
    Array.from({ length: capacity + 1 }, () => 0)
  )

  for (let i = 1; i <= items.length; i += 1) {
    const item = items[i - 1]

    for (let time = 0; time <= capacity; time += 1) {
      dp[i][time] = dp[i - 1][time]

      if (item.time <= time) {
        dp[i][time] = Math.max(
          dp[i][time],
          dp[i - 1][time - item.time] + item.score
        )
      }
    }
  }

  const selected_questions: OptimalQuestionRow[] = []
  let time = capacity

  for (let i = items.length; i >= 1; i -= 1) {
    if (dp[i][time] !== dp[i - 1][time]) {
      const item = items[i - 1]
      selected_questions.unshift({
        id: item.id,
        text: item.text,
        score: item.score,
        time: item.time
      })
      time -= item.time
    }
  }

  const total_score = selected_questions.reduce(
    (sum, question) => sum + (question.score ?? 0),
    0
  )
  const total_time = selected_questions.reduce(
    (sum, question) => sum + (question.time ?? 0),
    0
  )

  return {
    selected_questions,
    total_score,
    total_time,
    remaining_time: Math.max(0, capacity - total_time)
  }
}
