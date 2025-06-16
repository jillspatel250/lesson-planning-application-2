"use client";

import { useMemo } from "react";
import { useDashboardContext } from "@/context/DashboardContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoleDataItem } from "@/context/DashboardContext";

function PrincipalDashboard() {
  const { roleData, currentRole, setCurrentRole } = useDashboardContext();

  const uniqueRoles = useMemo(() => {
    const unique = new Map<string, RoleDataItem>();
    roleData.forEach((role) => {
      if (!unique.has(role.role_name)) {
        unique.set(role.role_name, role);
      }
    });
    return Array.from(unique.values());
  }, [roleData]);

  const handleRoleChange = (roleName: string) => {
    const selectedRole = roleData.find((role) => role.role_name === roleName);
    if (selectedRole) {
      setCurrentRole(selectedRole);
    }
  };

  return (
    <div className="pt-3 px-5">
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <p className="text-[#1A5CA1] font-manrope font-bold text-[25px] leading-[25px]">
          {currentRole.role_name} Dashboard
        </p>
        <div>
          <Select
            onValueChange={handleRoleChange}
            value={currentRole.role_name || ""}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={currentRole.role_name || "Select Role"}
              />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoles.map((role, idx) => (
                <SelectItem value={role.role_name} key={idx}>
                  {role.role_name === "Faculty"
                    ? "Subject Teacher"
                    : role.role_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default PrincipalDashboard;
