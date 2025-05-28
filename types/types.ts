interface Users {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  profile_photo: string | null;
}

interface Institues {
  id: string;
  name: string;
  abbreviation_insti: string;
}

interface Departments {
  id: string;
  name: string;
  abbreviation_depart: string;
  institues: {
    id: string;
    name: string;
    abbreviation_insti: string;
  };
}

interface Subjects {
  id: string;
  code: string;
  name: string;
  semester: number;
  lecture_hours: number;
  lab_hours: number;
  abbreviation_name: string;
  credites: number;
  departments: {
    id: string;
    name: string;
    abbreviation_depart: string;
    institues: {
      id: string;
      name: string;
      abbreviation_insti: string;
    };
  };
  is_practical: boolean;
  is_theory: boolean;
  academic_year?: string; // Optional because it's not always present
  division?: string;      // Optional because it's not always present
}

interface User_Role {
  depart_id: string | undefined;
  id: string;
  users: {
    id: string;
    auth_id: string;
    email: string;
    name: string;
    profile_photo: string | null;
  };
  role_name: string;
  departments: {
    id: string;
    name: string;
    abbreviation_depart: string;
    institues: {
      id: string;
      name: string;
      abbreviation_insti: string;
    };
  };
  subjects: Subjects;
  academic_year: string | null;
  division: string | null;
}

interface Faculty_Subjects {
  id: string;
  faculty_id: string;
  departments: {
    id: string;
    name: string;
    abbreviation_depart: string;
    institues: {
      id: string;
      name: string;
      abbreviation_insti: string;
    };
  };
  subjects: Subjects;
}

interface Student_data {
  student_id_number: string;
  gender: string;
  date_of_birth: string;
  ph_number: string;
  dept_id: string;
  sem: number;
  batch_councellor: string;
  father_number: string;
  father_email: string;
  mother_number: string;
  first_name: string;
  last_name: string;
  email: string;
  division: string;
  batch: string;
}

interface Timetable {
  date: string;
  type: string;
  subject: string;
  faculty: string;
  department: string;
  to: string;
  from: string;
  division: string;
  batch: string;
}

export type {
  Users,
  Institues,
  Departments,
  User_Role,
  Subjects,
  Faculty_Subjects,
  Student_data,
  Timetable,
};
