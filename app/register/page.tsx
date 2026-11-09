
import Link from 'next/link'
import { signup } from '../login/actions'



export const instant = false

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-bold text-white">
            S
          </div>

          <h1 className="text-3xl font-bold text-white">
            Secure Notes
          </h1>

          <p className="mt-2 text-slate-400">
            Create your private tutor workspace.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">

          <h2 className="text-2xl font-semibold text-white">
            Create your account
          </h2>

          <p className="mb-6 mt-2 text-sm text-slate-400">
            Enter your details to get started.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <form action={signup} className="space-y-5">

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tutor@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="register-password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Your password must contain at least 8 characters.
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Create account
            </button>

          </form>

          <div className="mt-6 border-t border-slate-800 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Sign in instead
            </Link>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Secure Notes © 2026 · Private tutor workspace
        </p>

      </div>
    </main>
  )
}
