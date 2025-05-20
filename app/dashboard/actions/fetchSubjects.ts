"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchSubjects = async () => {
  const supabase = await createClient();
  const { data: subjectData, error } = await supabase
    .from("subjects")
    .select("*, departments(*, institutes(*))");

  if (error) {
    console.error("Error fetching subject data:", error);
    return [];
  }

  return subjectData;
};
