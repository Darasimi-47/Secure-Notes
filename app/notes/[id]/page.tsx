
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '../../lib/supabase/server'
import { updateNote, deleteNote } from '../../actions'

export const instant = false

function LoadingNote() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
      Loading note...
    </main>
  )
}

async function NoteEditor({
  id,
  error,
}: {
  id: string
  error?: string
}) {
  if (!/^\d+$/.test(id)) notFound()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: note, error: noteError } = await supabase
    .from('notes')
    .select('id, title, body, created_at')
    .eq('id', id)
    .maybeSingle()

  // RLS ensures that a tutor cannot retrieve another tutor's note.
  if (noteError || !note) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          ← Back to all notes
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Secure Notes
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Edit your note
          </h1>

          <p className="mt-2 break-all text-sm text-slate-400">
            Logged in as {user.email}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <form
          action={updateNote}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
        >
          <input type="hidden" name="id" value={note.id} />

          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Note title *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={150}
              defaultValue={note.title}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="body"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Note details
            </label>

            <textarea
              id="body"
              name="body"
              rows={9}
              defaultValue={note.body ?? ''}
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 leading-6 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <p className="mb-6 text-xs text-slate-500">
            Created: {new Date(note.created_at).toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              Save changes
            </button>

            <Link
              href="/"
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>

        <section className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="text-lg font-semibold text-red-300">
            Delete this note
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Deleting this note is permanent. You will not be able to recover it.
          </p>

          <form action={deleteNote} className="mt-5">
            <input type="hidden" name="id" value={note.id} />

            <button
              type="submit"
              className="rounded-lg border border-red-500/40 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Delete note
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default async function NotePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([
    params,
    searchParams,
  ])

  return (
    <Suspense fallback={<LoadingNote />}>
      <NoteEditor id={id} error={error} />
    </Suspense>
  )
}
