/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";


export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login')
}