'use client';

import { createContext, useContext, ReactNode, useState } from "react";

export type UserData = {
  id: string;
  auth_id: string;
  email: string;
  profile_photo: string | null;
  name: string;
};

export type RoleDataItem = {
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
    };
  };
};

interface DashboardContextType {
  userData: UserData;
  roleData: RoleDataItem[];
  currentRole: RoleDataItem;
  setCurrentRole: (role: RoleDataItem) => void;
}
const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ 
  children,
  value 
}: { 
  children: ReactNode;
  value: Omit<DashboardContextType, 'currentRole' | 'setCurrentRole'>;
}) => {
  const [currentRole, setCurrentRole] = useState<RoleDataItem>(value.roleData[0]);

  return (
    <DashboardContext.Provider value={{ ...value, currentRole, setCurrentRole }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within DashboardProvider");
  }
  return context;
};