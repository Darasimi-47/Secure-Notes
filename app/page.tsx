
import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from './lib/supabase/server'
import { createNote, logout, deleteNote } from './actions'

export const instant = false

function LoadingNotes() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
        Loading your private notes...
      </div>
    </main>
  )
}

async function NotesDashboard({
  error,
}: {
  error?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('id, title, body, created_at, updated_at')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              Secure<span className="text-emerald-400">Notes</span>
            </h1>
            <p className="text-xs text-slate-400">
              Your private workspace
            </p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-red-400"
            >
              Log out
            </button>
          </form>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-10">

        {/* Welcome Section */}
        <section className="mb-10 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 p-7 sm:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            Tutor Dashboard
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            Welcome back!
          </h2>

          <p className="mt-3 break-all text-slate-300">
            Logged in as {user.email}
          </p>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400">
            Keep track of your students' academic progress.
            Your notes are private and accessible only through your account.
          </p>
        </section>

        {/* Create New Note */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Create a new note
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Record a student's progress or learning experience.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <form
            action={createNote}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-5">
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
                placeholder="e.g. Tolu, Mathematics"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="body"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Note details
              </label>

              <textarea
                id="body"
                name="body"
                rows={5}
                placeholder="Write your student's progress here..."
                className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-7 py-3 font-semibold text-white transition hover:bg-emerald-600"
            >
              + Save note
            </button>
          </form>
        </section>

        {/* Saved Notes */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                My saved notes
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your personal collection of student records.
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              {notes?.length ?? 0} notes
            </span>
          </div>

          {notesError ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
              Could not load your notes. Please refresh the page.
            </div>
          ) : notes && notes.length > 0 ? (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {notes.map((note) => (
                <article
                  key={note.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-emerald-500/50"
                >

                  {/* Entire card opens the individual note */}
                  <Link
                    href={`/notes/${note.id}`}
                    aria-label={`Read ${note.title}`}
                    className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-emerald-400"
                  />

                  <div className="pointer-events-none relative z-10 mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                      📝
                    </div>

                    <span className="text-xs text-slate-500">
                      #{note.id}
                    </span>
                  </div>

                  <h3 className="pointer-events-none relative z-10 mb-3 break-words text-lg font-bold transition group-hover:text-emerald-400">
                    {note.title}
                  </h3>

                  <p className="pointer-events-none relative z-10 mb-6 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                    {note.body || 'No additional details provided.'}
                  </p>

                  <div className="pointer-events-none relative z-10 mb-4 border-t border-slate-800 pt-4">
                    <span className="text-xs text-slate-500">
                      Created: {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Note Actions */}
                  <div className="relative z-20 flex flex-wrap items-center gap-3">

                    <Link
                      href={`/notes/${note.id}`}
                      className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Read / Edit
                    </Link>

                    <form action={deleteNote}>
                      <input
                        type="hidden"
                        name="id"
                        value={note.id}
                      />

                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </form>

                  </div>
                </article>
              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-6 py-16 text-center">
              <div className="mb-4 text-5xl">📚</div>

              <h3 className="text-xl font-bold">
                No notes yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                You haven't saved any notes. Create your first
                student record using the form above.
              </p>
            </div>

          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          Secure Notes © 2026. Your notes, your privacy.
        </footer>

      </div>
    </main>
  )
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <Suspense fallback={<LoadingNotes />}>
      <NotesDashboard error={error} />
    </Suspense>
  )
}
