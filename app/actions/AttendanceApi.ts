import { createClient } from '@/utils/supabase/server';
import { Attendance } from '@/types/types';

// Create attendance
export async function insertAttendance(
  attendance: Omit<Attendance, 'id'> & {
    Date: string;
    student_id: string;
    faculty_id?: string;
  }
) {
  const supabase = await createClient();
  const record = {
    ...attendance,
    Date: attendance.Date,
    student_id: attendance.student_id,
    ...(attendance.faculty_id && attendance.faculty_id.trim() !== ''
      ? { faculty_id: attendance.faculty_id }
      : {}),
  };
  const { data, error } = await supabase
    .from('attendance')
    .insert([record])
    .select();
  if (error) throw error;
  return data;
}

// Update attendance by id
export async function updateAttendance(
  id: string,
  updates: Partial<Attendance> & { Date?: string }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

// Delete attendance by id
export async function deleteAttendance(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

// Get all attendance records
export async function getAllAttendance() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('attendance').select();
  if (error) throw error;
  return data;
}

// Get attendance by id
export async function getAttendanceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select()
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Get attendance by student id
export async function getAttendanceByStudentId(student: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select()
    .eq('student_id', student);
  if (error) throw error;
  return data;
}

// Bulk insert attendance for present and absent students for a single lecture
export async function insertBulkAttendanceByStatus(
  lecture: string,
  presentIds: string[],
  absentIds: string[],
  Date: string,
  faculty_id?: string
) {
  const supabase = await createClient();

  // Guard clause: if both arrays are empty, return error
  if (
    (!presentIds || presentIds.filter(Boolean).length === 0) &&
    (!absentIds || absentIds.filter(Boolean).length === 0)
  ) {
    throw new Error('No present or absent student IDs provided');
  }
  // Prepare attendance records for present students
  const presentRecords = presentIds.filter(Boolean).map((student_id) => ({
    lecture,
    student_id,
    is_present: true,
    Date,
    ...(faculty_id && faculty_id.trim() !== '' ? { faculty_id } : {}),
  }));
  // Prepare attendance records for absent students
  const absentRecords = absentIds.filter(Boolean).map((student_id) => ({
    lecture,
    student_id,
    is_present: false,
    Date,
    ...(faculty_id && faculty_id.trim() !== '' ? { faculty_id } : {}),
  }));
  // Combine all records
  const records = [...presentRecords, ...absentRecords];
  const { data, error } = await supabase
    .from('attendance')
    .insert(records)
    .select();
  if (error) throw error;
  return data;
}
