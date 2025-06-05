// "use server"

// import { createClient } from "@/utils/supabase/server"
// import { revalidatePath } from "next/cache"

// export async function addFaculty(formData: FormData) {
//   try {
//     const supabase = createClient()

//     const userId = formData.get("userId") as string
//     const departId = formData.get("departId") as string
//     const subjectId = (formData.get("subjectId") as string) || null
//     const academic_year = formData.get("academicYear") as string
//     const division = formData.get("division") as string

//     // Insert into user_role table
//     const { data, error } = await (await supabase)
//       .from("user_role")
//       .insert({
//         user_id: userId,
//         role_name: "Faculty",
//         depart_id: departId,
//         subject_id: subjectId,
//         academic_year: academic_year,
//         division: division,
//       })
//       .select()

//     if (error) {
//       console.log("Error inserting into user_role:", error)
//       return { success: false, error: error.message }
//     }

//     revalidatePath("/dashboard")
//     return { success: true, data }
//   } catch (error) {
//     console.error("Error adding faculty:", error)
//     return { success: false, error: "Failed to add faculty" }
//   }
// }

// export async function editFaculty(formData: FormData) {
//   try {
//     const supabase = createClient()

//     const id = formData.get("id") as string
//     const userId = formData.get("userId") as string
//     const departId = formData.get("departId") as string
//     const subjectId = (formData.get("subjectId") as string) || null
//     const academic_year = formData.get("academicYear") as string
//     const division = formData.get("division") as string

//     // Update user_role table
//     const { data, error } = await (await supabase)
//       .from("user_role")
//       .update({
//         user_id: userId,
//         role_name: "Faculty",
//         depart_id: departId,
//         subject_id: subjectId,
//         academic_year: academic_year,
//         division: division,
//       })
//       .eq("id", id)
//       .select()

//     if (error) {
//       console.log("Error updating user_role:", error)
//       return { success: false, error: error.message }
//     }

//     revalidatePath("/dashboard")
//     return { success: true, data }
//   } catch (error) {
//     console.error("Error editing faculty:", error)
//     return { success: false, error: "Failed to edit faculty" }
//   }
// }

// export async function deleteFaculty(id: string) {
//   try {
//     const supabase = createClient()

//     // Delete from user_role table
//     const { error } = await (await supabase).from("user_role").delete().eq("id", id)

//     if (error) {
//       console.log("Error deleting from user_role:", error)
//       return { success: false, error: error.message }
//     }

//     revalidatePath("/dashboard")
//     return { success: true }
//   } catch (error) {
//     console.error("Error deleting faculty:", error)
//     return { success: false, error: "Failed to delete faculty" }
//   }
// }

"use server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/adminClient";
import { v4 as uuid } from "uuid";

export const addFaculty = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const departId = formData.get("departId") as string;
    const subjectId = formData.get("subjectId") as string;
    const academicYear = formData.get("academicYear") as string;
    const division = formData.get("division") as string;
    
    const supabaseAdmin = createAdminClient();
    const supabase = await createClient();
    
    // Create user in Supabase Auth with random password
    const randomPassword = uuid();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, 
    });
    
    if (authError) {
      console.error("Auth error:", authError);
      return { success: false, error: authError.message };
    }
    
    if (!authData.user) {
      return { success: false, error: "Failed to create user" };
    }
    
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        auth_id: authData.user.id,
        name,
        email,
      })
      .select("*")
      .single();
    
    if (userError) {
      console.error("User table error:", userError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: userError.message };
    }
    
    const { data: roleData, error: roleError } = await supabase
      .from("user_role")
      .insert({
        user_id: authData.user.id,
        role_name: "Faculty",
        depart_id: departId,
        subject_id: subjectId || null,
        academic_year: academicYear,
        division,
      })
      .select("*")
      .single();
    
    if (roleError) {
      console.error("User role error:", roleError);
      await supabase.from("users").delete().eq("auth_id", authData.user.id);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: roleError.message };
    }
    
    return { 
      success: true, 
      data: { 
        user: userData, 
        role: roleData,
        tempPassword: randomPassword 
      } 
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const editFaculty = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subjectId = formData.get("subjectId") as string;
    const academicYear = formData.get("academicYear") as string;
    const division = formData.get("division") as string;

    const supabase = await createClient();

    // Get the current user_role to find the user_id
    const { data: currentRole, error: getCurrentError } = await supabase
      .from("user_role")
      .select("user_id")
      .eq("id", id)
      .single();

    if (getCurrentError) {
      return { success: false, error: getCurrentError.message };
    }

    // Update user_role table
    const { data: roleData, error: roleError } = await supabase
      .from("user_role")
      .update({
        subject_id: subjectId || null,
        academic_year: academicYear,
        division,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (roleError) {
      return { success: false, error: roleError.message };
    }

    // Update users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({
        name,
        email,
      })
      .eq("auth_id", currentRole.user_id)
      .select("*")
      .single();

    if (userError) {
      return { success: false, error: userError.message };
    }

    return { success: true, data: { user: userData, role: roleData } };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

export const deleteFaculty = async (roleId: string) => {
  try {
    const supabase = await createClient();

    // Get the user_id before deleting the role
    const { data: roleData, error: getRoleError } = await supabase
      .from("user_role")
      .select("user_id")
      .eq("id", roleId)
      .single();

    if (getRoleError) {
      return { success: false, error: getRoleError.message };
    }

    // Delete from user_role table
    const { error: roleDeleteError } = await supabase
      .from("user_role")
      .delete()
      .eq("id", roleId);

    if (roleDeleteError) {
      return { success: false, error: roleDeleteError.message };
    }

    // Check if user has other roles
    const { data: otherRoles, error: checkRolesError } = await supabase
      .from("user_role")
      .select("id")
      .eq("user_id", roleData.user_id);

    if (checkRolesError) {
      return { success: false, error: checkRolesError.message };
    }

    // If no other roles exist, delete the user from users table and auth
    if (otherRoles.length === 0) {
      // Delete from users table
      const { error: userDeleteError } = await supabase
        .from("users")
        .delete()
        .eq("auth_id", roleData.user_id);

      if (userDeleteError) {
        console.error("Error deleting from users table:", userDeleteError);
      }

      // Delete from auth
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(roleData.user_id);

      if (authDeleteError) {
        console.error("Error deleting from auth:", authDeleteError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};
