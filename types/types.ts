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

interface User_Role {
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
  subjects: {
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
    academic_year: string;
    divison: string;
  };
}

export type { Users, Institues, Departments, User_Role, Subjects, Faculty_Subjects };
