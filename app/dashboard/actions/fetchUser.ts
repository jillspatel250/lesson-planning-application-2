"use server"

import { createClient } from "@/utils/supabase/server";

export const fetchUsers = async () => {
  const supabase = await createClient();
  
  // Fetch user data
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*");

  if (userError) {
    console.error("Error fetching user data:", userError);
    return { userData: [], roleData: [] };
  } 

  // Fetch role data
  const { data: roles, error: roleError } = await supabase
    .from("user_role")
    .select(`
      id,
      role_name,
      user_id,
      depart_id,
      departments(
        id,
        name,
        abbreviation_depart,
        institutes(
          id,
          name,
          abbreviation_insti
        )
      )
    `);

  if (roleError) {
    console.error("Error fetching role data:", roleError);
    return { userData: user || [], roleData: [] };
  }

  console.log(user, roles);
  return { userData: user || [], roleData: roles || [] };
};