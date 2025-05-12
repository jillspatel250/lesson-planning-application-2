'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/reset-password')
  return { success: 'Check your email for the password reset link' }
}