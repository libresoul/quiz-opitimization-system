'use client'

export default function signUp() {
  const handleSignUp = (formData: FormData) => {
    console.log(Object.fromEntries(formData))
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-5 rounded-xl mx-auto my-10 dark:bg-neutral-900 shadow-md dark-border">
        <h1 className="font-bold font-inter">Create an account</h1>
        <p className="text-[0.85em] text-neutral-500">
          Enter your information below to create your account
        </p>

        <form action={handleSignUp}>
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
