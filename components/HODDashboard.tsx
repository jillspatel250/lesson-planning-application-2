"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDashboardContext } from "@/context/DashboardContext";
import { BookOpen, Plus, Users } from "lucide-react";
import { fetchFaculty } from "@/app/dashboard/actions/fetchTotalFculty";
import { fetchSubjects } from "@/app/dashboard/actions/fetchSubjects";
import { Button } from "./ui/button";
import { User_Role, Subjects } from "@/types/types";

type RoleDataItem = {
  id: string;
  role_name: string;
  user_id: string;
  depart_id: string;
  departments: {
    id: string;
    name: string;
    abbreviation_depart: string;
    institutes: {
      id: string;
      name: string;
      abbreviation_insti: string;

    }
  }
};

export default function HODDashboard() {
  const { roleData, currentRole, setCurrentRole } = useDashboardContext();
  const [role, setRole] = useState<RoleDataItem>();
  const [faculty, setFaculty] = useState<User_Role[]>([]);
  const [subjects, setSubjects] = useState<Subjects[]>([]);

  const handleRoleChange = (roleName: string) => {
    const selectedRole = roleData.find((role) => role.role_name === roleName);
    if (selectedRole) {
      setCurrentRole(selectedRole);
    }
  };

  useEffect(() => {
    const foundRole = roleData.find(
      (x) => x.role_name === currentRole.role_name
    );
    setRole(foundRole);
  }, [roleData, currentRole]);

  useEffect(() => {
    const getFacultyData = async () => {
      try {
        const data = await fetchFaculty();
        const departFaculty = data.filter(
          (faculty) =>
            faculty.depart_id === currentRole.depart_id &&
            faculty.role_name == "Faculty"
        );


        setFaculty(departFaculty);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    const getSubjectData = async () => {
      try {
        const data = await fetchSubjects();
        const departSubjects = data.filter(
          (subject) => subject.department_id === currentRole.depart_id
        );

        setSubjects(departSubjects);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    getFacultyData();
    getSubjectData();
  }, [currentRole.depart_id]);

  return (
    <div>
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
          {currentRole.role_name} Dashboard
        </p>
        <div>
          <Select
            onValueChange={handleRoleChange}
            value={currentRole.role_name}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={currentRole.role_name} />
            </SelectTrigger>
            <SelectContent>
              {roleData.map((role, idx) => (
                <SelectItem value={role.role_name} key={idx}>
                  {role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {currentRole.role_name === "HOD" ? (
          <div>
            <div className="flex flex-col justify-around pl-5 py-2 bg-[#EBF5FF] h-[77px] rounded-[10px] border border-gray-400 mt-3">
              <h3 className="text-[#1A5CA1] font-manrope font-bold text-[20px] leading-[100%] tracking-[0em]">
                {currentRole.departments.institutes.name}
              </h3>
              <h2 className="font-manrope font-medium text-[18px] leading-[100%] tracking-[0em]">
                {currentRole.departments.name}
              </h2>
            </div>

            <div className="grid grid-cols-5 gap-5 mt-3">
              <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
                <div className="flex flex-col justify-between h-14">
                  <h3 className="font-manrope font-semibold text-[17px] leading-[100%] tracking-[0em]">
                    Total Faculty
                  </h3>
                  <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
                    {faculty.length}
                  </p>
                </div>
                <Users className="size-11" />
              </div>
              <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
                <div className="flex flex-col justify-between h-14">
                  <h3 className="font-manrope font-semibold text-[16px] leading-[100%] tracking-[0em]">
                    Total Subjects
                  </h3>
                  <p className="font-manrope font-bold text-[30px] leading-[100%] tracking-[0em] text-[#1A5CA1]">
                    {subjects.length}
                  </p>
                </div>
                <BookOpen className="size-11" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="border rounded-lg border-black p-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-manrope font-semibold text-[18px] leading-[100%] tracking-[0]">
                    Faculty Management
                  </h2>
                  <Button>
                    <div className="flex items-center gap-2">
                      <Plus />
                      <p>Add Faculty</p>
                    </div>
                  </Button>
                </div>
                <hr className="border-1 border-black mt-3" />
                <div className="mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[28%]">Name</TableHead>
                        <TableHead className="w-[45%]">Email</TableHead>
                        <TableHead className="w-[19%]">Subjects</TableHead>
                        <TableHead className="w-[10%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faculty.map((ele) => (
                        <TableRow key={ele.id}>
                          <TableCell className="font-medium">
                            {ele.users.name}
                          </TableCell>
                          <TableCell>{ele.users.email}</TableCell>
                          <TableCell>MPCO, PY</TableCell>
                          <TableCell>
                            <Button>View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="border rounded-lg border-black">b</div>
            </div>
          </div>
        ) : (
          <div>{JSON.stringify(role)}</div>
        )}
      </div>
    </div>
  );
}
