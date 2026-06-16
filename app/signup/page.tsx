'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { signUpSchema as baseSchema } from '@/types/api'

const signUpSchema = baseSchema
  .extend({
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type SignUpFieldErrors = z.inferFlattenedErrors<
  typeof signUpSchema
>['fieldErrors']

export default function signUp() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<SignUpFieldErrors | null>(null)

  const handleSignUp = async (formData: FormData) => {
    setErrors(null)
    const signUpData = signUpSchema.safeParse(Object.fromEntries(formData))

    if (!signUpData.success) {
      setErrors(z.flattenError(signUpData.error).fieldErrors)
      return
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData))
    })

    if (!response.ok) {
      toast.error('Registration failed')
    }

    const data = await response.json()

    if (data.success) {
      formRef.current?.reset()
      toast.success('Registration success!')
      setTimeout(() => {
        toast.success('Redirecting...')
      }, 1000)
      setTimeout(() => {
        router.replace('/dashboard')
      }, 1500)
    }
  }

  const errorMessages = Object.entries(errors ?? {}).flatMap(
    ([field, messages]) =>
      (messages ?? []).map((message, index) => ({
        id: `${field}-${index}`,
        text: `${field}: ${message}`
      }))
  )

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-5 rounded-xl mx-auto my-10 dark:bg-neutral-900 shadow-md dark-border">
        {errorMessages.length > 0 ? (
          <div className="mb-5 rounded border border-red-500/30 bg-red-900/20 p-4">
            {errorMessages.map((error) => (
              <p className="text-sm" key={error.id}>
                {error.text}
              </p>
            ))}
          </div>
        ) : null}

        <h1 className="font-bold font-inter">Create an account</h1>
        <p className="text-[0.85em] text-neutral-500">
          Enter your information below to create your account
        </p>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSignUp(new FormData(e.currentTarget))
          }}
        >
          <div>
            <label className="text-sm" htmlFor="fname">
              Full Name
            </label>
            <input
              id="fname"
              name="fullName"
              type="text"
              placeholder="Damindu Dhananjitha"
              className="dark-border rounded-lg mt-2 py-1 px-4 text-sm"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contact@damindu.me"
              className="dark-border rounded-lg mt-2 py-1 px-4 text-sm"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="fname">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={6}
              maxLength={24}
              placeholder="XXXXXX"
              className="dark-border rounded-lg mt-2 py-1 px-4 text-sm"
            />
          </div>
          <div>
            <label className="text-sm" htmlFor="confpassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confpassword"
              name="confirmPassword"
              minLength={6}
              maxLength={24}
              placeholder="XXXXXX"
              className="dark-border rounded-lg mt-2 py-1 px-4 text-sm"
            />
          </div>
          <div>
            <button
              className="text-white bg-black dark:text-black dark:bg-white rounded-lg py-2 
            hover:opacity-85 cursor-pointer font-inter font-semibold text-sm"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-neutral-500 mt-2">
          Already have an account?
          <a
            href="/login"
            className="underline underline-offset-2 hover:text-black dark:hover:text-white"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
