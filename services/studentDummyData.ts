export interface Student {
  id: number;
  student_id: string;
  name: string;
  photo: string;
  present: boolean;
  counselorName: string;
}

export const students: Student[] = [
  {
    id: 1,
    student_id: "22dcs001",
    name: "Pooja Desai",
    photo: "/student1.png", // Use a placeholder image path
    present: true,
    counselorName: "Arpit Bhatt"
  },
  {
    id: 2,
    student_id: "22dcs001",
    name: "Pooja Desai",
    photo: "/student1.png",
    present: true,
    counselorName: "Arpit Bhatt"
  },
  {
    id: 3,
    student_id: "22dcs001",
    name: "Pooja Desai",
    photo: "/student1.png",
    present: false,
    counselorName: "Arpit Bhatt"
  },
  {
    id: 4,
    student_id: "22dcs001",
    name: "Pooja Desai",
    photo: "/student1.png",
    present: false,
    counselorName: "Arpit Bhatt"
  },
  {
    id: 5,
    student_id: "22dcs001",
    name: "Pooja Desai",
    photo: "/student1.png",
    present: false,
    counselorName: "Arpit Bhatt"
  }
];
