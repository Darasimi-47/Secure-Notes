
'use server'

import { createClient } from '../lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    redirect('/login?error=Please%20fill%20in%20all%20fields')
  }

  if (password.length < 8) {
    redirect('/login?error=Password%20must%20be%20at%20least%208%20characters')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Unable%20to%20create%20account.%20Please%20try%20again')
  }

  redirect('/')
}

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    redirect('/login?error=Wrong%20email%20or%20password')
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Wrong%20email%20or%20password')
  }

  redirect('/')
}
