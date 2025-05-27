import { createClient } from '@/utils/supabase/server';
import { Timetable } from '@/types/types';

export async function insertTimetable(timetable: Timetable) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('timetable')
    .insert([timetable])
    .select();
  if (error) throw error;
  return data;
}

export async function updateTimetable(id: string, updates: Partial<Timetable>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('timetable')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteTimetable(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('timetable')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function getAllTimetables() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('timetable').select();
  if (error) throw error;
  return data;
}

export async function getTimetableById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('timetable')
    .select()
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
