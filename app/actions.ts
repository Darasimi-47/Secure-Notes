
'use server'

import { createClient } from './lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function createNote(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '')

  if (!title) {
    redirect('/?error=Please%20enter%20a%20note%20title')
  }

  if (title.length > 150) {
    redirect('/?error=Title%20must%20not%20exceed%20150%20characters')
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('notes')
    .insert({ title, body })

  if (error) {
    redirect('/?error=Unable%20to%20save%20your%20note')
  }

  revalidatePath('/')
  redirect('/')
}

export async function updateNote(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '')

  if (!/^\d+$/.test(id)) {
    redirect('/')
  }

  if (!title) {
    redirect(`/notes/${id}?error=Please%20enter%20a%20note%20title`)
  }

  if (title.length > 150) {
    redirect(`/notes/${id}?error=Title%20must%20not%20exceed%20150%20characters`)
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('notes')
    .update({ title, body })
    .eq('id', id)

  if (error) {
    redirect(`/notes/${id}?error=Unable%20to%20update%20your%20note`)
  }

  revalidatePath('/')
  revalidatePath(`/notes/${id}`)
  redirect('/')
}

export async function deleteNote(formData: FormData) {
  const id = String(formData.get('id') ?? '')

  if (!/^\d+$/.test(id)) {
    redirect('/')
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) {
    redirect(`/notes/${id}?error=Unable%20to%20delete%20your%20note`)
  }

  revalidatePath('/')
  revalidatePath(`/notes/${id}`)
  redirect('/')
}
