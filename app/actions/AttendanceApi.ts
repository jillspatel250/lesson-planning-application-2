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
  const { data, error } = await supabase
    .from('attendance')
    .select(
      '*, timetable:lecture(subject, faculty, department, from, to, subjects:subject(code, name, departments(name)), faculty_details:faculty(name)), student:student_id(first_name, last_name, email)'
    );
  if (error) throw error;
  if (!data || data.length === 0) return [];
  return data.map((item) => {
    const { timetable, student, ...rest } = item;
    return {
      ...rest,
      subject_code: timetable?.subjects?.code,
      subject_name: timetable?.subjects?.name,
      faculty_name: timetable?.faculty_details?.name,
      department_name: timetable?.subjects?.departments?.name,
      from: timetable?.from,
      to: timetable?.to,
      student_first_name: student?.first_name,
      student_last_name: student?.last_name,
      student_email: student?.email,
    };
  });
}

// Get attendance by id
export async function getAttendanceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select(
      '*, timetable:lecture(subject, faculty, department, from, to, subjects:subject(code, name, departments(name)), faculty_details:faculty(name)), student:student_id(first_name, last_name, email)'
    )
    .eq('id', id)
    .maybeSingle(); // Use maybeSingle to avoid error if not found
  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;
  const { timetable, student, ...rest } = data;
  return {
    ...rest,
    subject_code: timetable?.subjects?.code,
    subject_name: timetable?.subjects?.name,
    faculty_name: timetable?.faculty_details?.name,
    department_name: timetable?.subjects?.departments?.name,
    from: timetable?.from,
    to: timetable?.to,
    student_first_name: student?.first_name,
    student_last_name: student?.last_name,
    student_email: student?.email,
  };
}

// Get attendance by student id
export async function getAttendanceByStudentId(studentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select(
      '*, timetable:lecture(subject, faculty, department, from, to, subjects:subject(code, name, departments(name)), faculty_details:faculty(name))'
    )
    .eq('student_id', studentId);
  if (error) throw error;
  if (!data || data.length === 0) return [];
  return data.map((item) => {
    const { timetable, ...rest } = item;
    return {
      ...rest,
      subject_code: timetable?.subjects?.code,
      subject_name: timetable?.subjects?.name,
      faculty_name: timetable?.faculty_details?.name,
      department_name: timetable?.subjects?.departments?.name,
      from: timetable?.from,
      to: timetable?.to,
    };
  });
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

// Get all presentees and absentees for a lecture
export async function getAttendanceStatusByLecture(lectureId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select(
      'is_present, student:student_id(first_name, last_name, email), timetable:lecture(subjects:subject(name, code), faculty_details:faculty(name))'
    )
    .eq('lecture', lectureId);

  if (error) throw error;
  if (!data || data.length === 0) return { presentees: [], absentees: [] };

  const presentees = data
    .filter((item) => item.is_present)
    .map((item) => ({
      student_first_name: item.student?.[0]?.first_name,
      student_last_name: item.student?.[0]?.last_name,
      student_email: item.student?.[0]?.email,
      subject_name: item.timetable?.[0]?.subjects?.[0]?.name,
      subject_code: item.timetable?.[0]?.subjects?.[0]?.code,
      faculty_name: item.timetable?.[0]?.faculty_details?.[0]?.name,
    }));

  const absentees = data
    .filter((item) => !item.is_present)
    .map((item) => ({
      student_first_name: item.student?.[0]?.first_name,
      student_last_name: item.student?.[0]?.last_name,
      student_email: item.student?.[0]?.email,
      subject_name: item.timetable?.[0]?.subjects?.[0]?.name,
      subject_code: item.timetable?.[0]?.subjects?.[0]?.code,
      faculty_name: item.timetable?.[0]?.faculty_details?.[0]?.name,
    }));

  return { presentees, absentees };
}
