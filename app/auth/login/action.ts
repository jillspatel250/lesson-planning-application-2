'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  try {
    // First, clear any existing session to avoid accumulation of cookie data
    await supabase.auth.signOut();
    
    // Then sign in with the new credentials
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/dashboard', 'layout');
    return { success: true }; 
  } catch (error: unknown) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Authentication failed');
    }
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}