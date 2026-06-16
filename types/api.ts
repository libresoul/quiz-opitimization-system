import z from 'zod'

export const signUpSchema = z.object({
  fullName: z.string().regex(/^[a-zA-Z']+\s[a-zA-Z']+$/, 'Invalid name'),
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signInSchema = signUpSchema.omit({
  fullName: true
})

export type SignUpRequest = z.infer<typeof signUpSchema>
export type SignInRequest = z.infer<typeof signInSchema>

export type QuizStatus = 'open' | 'draft'
export type AnswerStatus = 'correct' | 'incorrect'

export type QuizRow = {
  id: number
  title: string | null
  total_time: number | null
  status: QuizStatus | null
}

export type QuestionRow = {
  id: number
  quiz_id: number | null
  text: string | null
  score: number | null
  time: number | null
}

export type AnswerRow = {
  id: number
  user_id: string | null
  question_id: number | null
  text: string | null
  status: AnswerStatus | null
}

export type QuizQuestionRow = {
  id: number
  text: string | null
  score: number | null
  time: number | null
  answers: QuizAnswerRow[]
}

export type QuizAnswerRow = {
  id: number
  text: string | null
  status: AnswerStatus | null
}

export type QuizDetailRow = QuizRow & {
  questions: QuizQuestionRow[]
}

export type OptimalQuestionRow = Pick<
  QuestionRow,
  'id' | 'text' | 'score' | 'time'
>

export type OptimalSetResult = {
  quiz: QuizRow
  time_limit: number
  total_score: number
  total_time: number
  remaining_time: number
  selected_questions: OptimalQuestionRow[]
  available_questions: OptimalQuestionRow[]
}

export const optimalSetQuerySchema = z.object({
  timeLimit: z.coerce.number().int().positive().default(7)
})

export const submitAnswerSchema = z.object({
  questionId: z.coerce.number().int().positive(),
  text: z.string().min(1),
  status: z.enum(['correct', 'incorrect']).optional()
})

export type SubmitAnswerRequest = z.infer<typeof submitAnswerSchema>
