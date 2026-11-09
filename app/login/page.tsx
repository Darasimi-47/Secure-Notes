
import Link from 'next/link'
import { login } from './actions'


export const instant = false
type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-bold text-white">
            S
          </div>
          <h1 className="text-3xl font-bold text-white">Secure Notes</h1>
          <p className="mt-2 text-slate-400">Your teaching notes. Your private space.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mb-6 mt-2 text-sm text-slate-400">
            Sign in to access your private notes.
          </p>

          {error && (
            <div role="alert" className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tutor@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 transition"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-emerald-400 hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Secure Notes © 2026 · Private tutor workspace
        </p>
      </div>
    </main>
  )
}
