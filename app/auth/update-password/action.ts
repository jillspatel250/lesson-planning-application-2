'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyOtpAndUpdatePassword(formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const password = formData.get('password') as string
  
  if (!email || !otp || !password) {
    return { error: 'Missing required fields' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'recovery'
  })

  if (error) {
    return { error: 'Invalid or expired OTP. Please try again.' }
  }

  const { error: updateError } = await supabase.auth.updateUser({ password })

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/auth/update-password')
  return { success: 'Password updated successfully' }
}
