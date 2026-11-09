
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

  // Validate title
  if (!title) {
    redirect('/?error=Please%20enter%20a%20note%20title')
  }

  if (title.length > 150) {
    redirect('/?error=Title%20must%20not%20exceed%20150%20characters')
  }

  const supabase = await createClient()

  // Verify authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Save note. RLS assigns and protects user_id.
  const { error } = await supabase
    .from('notes')
    .insert({
      title,
      body,
    })

  if (error) {
    redirect('/?error=Unable%20to%20save%20your%20note')
  }

  revalidatePath('/')

  redirect('/')
}
