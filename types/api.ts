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
