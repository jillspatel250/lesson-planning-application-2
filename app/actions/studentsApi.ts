import { createClient } from '@/utils/supabase/server';
import { Student_data } from '@/types/types';

export async function insertStudent(student: Student_data) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_data')
    .insert([student])
    .select();
  if (error) throw error;
  return data;
}

export async function updateStudent(
  student_id: string,
  updates: Partial<Student_data>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_data')
    .update(updates)
    .eq('student_id', student_id)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteStudent(student_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_data')
    .delete()
    .eq('student_id', student_id)
    .select();
  if (error) throw error;
  return data;
}

export async function getAllStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('student_data').select();
  if (error) throw error;
  return data;
}

export async function getStudentById(student_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('student_data')
    .select()
    .eq('student_id', student_id)
    .single();
  if (error) throw error;
  return data;
}
