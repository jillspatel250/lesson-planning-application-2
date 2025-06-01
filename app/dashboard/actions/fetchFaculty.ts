"use server"

import { createClient } from "@/utils/supabase/server";

export const fetchFaculty = async () => {
    const supabase = await createClient();

    const { data: facultyData, error } = await supabase
        .from("user_role")
        .select("*, users(*), subjects(*)");

    if (error) {
        console.error("Error fetching faculty data:", error);
        return [];
    } 

    return facultyData;
}