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

export async function getTimetablesByFacultyId(facultyId: string) {
  const supabase = await createClient();
  // Use join (dot notation) to fetch subject code and name in one query
  const { data, error } = await supabase
    .from('timetable')
    .select('*, subjects:subject(code, name)')
    .eq('faculty', facultyId);
  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Flatten the subject fields for convenience, but do not duplicate
  const timetableWithSubjects = data.map((item) => {
    const { subjects, ...rest } = item;
    return {
      ...rest,
      subject_code: subjects?.code,
      subject_name: subjects?.name,
    };
  });

  return timetableWithSubjects;
}

// --- Merged from timetableAttendanceUtils.ts ---

export async function getTimetableForDateAndFaculty(
  dateStr: string,
  facultyId: string
) {
  const supabase = await createClient();
  // Get the day of week for the date (e.g., 'Monday')
  const date = new Date(dateStr);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = days[date.getUTCDay()];

  // Query timetable for that day and faculty, using date range for timestampz
  const { data, error } = await supabase
    .from('timetable')
    .select()
    .eq('day', dayOfWeek)
    .eq('faculty', facultyId)
    .gte('from', dateStr)
    .lt(
      'to',
      new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString()
    );
  if (error) throw error;
  return data;
}

export async function isAttendanceTaken(timetableId: string, dateStr: string) {
  const supabase = await createClient();
  // Convert dateStr to start and end of day in ISO format for timestampz comparison
  const date = new Date(dateStr);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();
  const { data, error } = await supabase
    .from('attendance')
    .select('id')
    .eq('lecture', timetableId)
    .gte('Date', startOfDay)
    .lte('Date', endOfDay);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

export async function getTimetableAndAttendanceStatus(
  day: string,
  facultyId: string,
  dateStr: string
) {
  const timetables = await getTimetableForDayAndFaculty(day, facultyId);
  const results = [];
  for (const timetable of timetables) {
    const taken = await isAttendanceTaken(timetable.id, dateStr);
    results.push({ ...timetable, attendanceTaken: taken });
  }
  return results;
}

// Helper to get timetable for a specific day and faculty
export async function getTimetableForDayAndFaculty(
  day: string,
  facultyId: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('timetable')
    .select()
    .eq('day', day)
    .eq('faculty', facultyId);
  if (error) throw error;
  return data;
}
