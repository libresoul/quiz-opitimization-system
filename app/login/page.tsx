'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { signInSchema } from '@/types/api'

type SignInFieldErrors = z.inferFlattenedErrors<
  typeof signInSchema
>['fieldErrors']

export default function Login() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<SignInFieldErrors | null>(null)

  const handleSignIn = async (formData: FormData) => {
    setErrors(null)
    const signInData = signInSchema.safeParse(Object.fromEntries(formData))

    if (!signInData.success) {
      setErrors(z.flattenError(signInData.error).fieldErrors)
      return
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData))
    })

    if (!response.ok) {
      toast.error('Login failed')
    }

    const data = await response.json()

    if (data.success) {
      formRef.current?.reset()
      toast.success('Login success!')
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

        <h1 className="font-bold font-inter">Login to your account</h1>
        <p className="text-[0.85em] text-neutral-500">
          Enter your information below to login to your account
        </p>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSignIn(new FormData(e.currentTarget))
          }}
        >
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
            <label className="text-sm" htmlFor="password">
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
            <button
              className="text-white bg-black dark:text-black dark:bg-white rounded-lg py-2 
            hover:opacity-85 cursor-pointer font-inter font-semibold text-sm"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-neutral-500 mt-2">
          New here?{' '}
          <Link
            href="/signup"
            className="underline underline-offset-2 hover:text-black dark:hover:text-white"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
