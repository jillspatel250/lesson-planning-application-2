"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchUsers= async () => {
  const supabase = await createClient();
  const { data: userData, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.error("Error fetching user data:", error);
    return [];
  } 

  return userData;
};
