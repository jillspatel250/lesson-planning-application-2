"use server"
import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/adminClient"

export const addFaculty = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const departId = formData.get("departId") as string
    const subjectId = formData.get("subjectId") as string
    const academicYear = formData.get("academicYear") as string
    const division = formData.get("division") as string

    const supabaseAdmin = createAdminClient()
    const supabase = await createClient()

    // Check if user already exists in users table
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("auth_id, id, email, name")
      .eq("email", email)
      .single()

    console.log("Existing user data:", existingUser)

    let authUserId: string
    let userData: any

    if (existingUser) {
      authUserId = existingUser.auth_id
      userData = existingUser

      // Update user name if different
      if (existingUser.name !== name) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({ name })
          .eq("auth_id", existingUser.auth_id)
          .select("*")
          .single()

        if (updateError) {
          console.error("Error updating user name:", updateError)
          return { success: false, error: updateError.message }
        }
        userData = updatedUser
      }
    } else {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: "depstar@charusat",
        email_confirm: true,
      })

      if (authError) {
        console.error("Auth error:", authError)
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Failed to create user" }
      }

      authUserId = authData.user.id

      const { data: newUserData, error: userError } = await supabase
        .from("users")
        .insert({
          auth_id: authUserId,
          name,
          email,
        })
        .select("*")
        .single()

      if (userError) {
        console.error("User table error:", userError)
        await supabaseAdmin.auth.admin.deleteUser(authUserId)
        return { success: false, error: userError.message }
      }

      userData = newUserData
    }

    const { data: existingRole, error: roleCheckError } = await supabase
      .from("user_role")
      .select("*")
      .eq("user_id", authUserId)
      .eq("role_name", "Faculty")
      .eq("depart_id", departId)
      .eq("subject_id", subjectId || null)
      .single()

    if (existingRole) {
      return { success: false, error: "Faculty role already exists for this user and subject" }
    }

    const { data: roleData, error: roleError } = await supabase
      .from("user_role")
      .insert({
        user_id: authUserId,
        role_name: "Faculty",
        depart_id: departId,
        subject_id: subjectId || null,
        academic_year: academicYear,
        division,
      })
      .select("*")
      .single()

    if (roleError) {
      console.error("User role error:", roleError)
      if (!existingUser) {
        await supabase.from("users").delete().eq("auth_id", authUserId)
        await supabaseAdmin.auth.admin.deleteUser(authUserId)
      }
      return { success: false, error: roleError.message }
    }

    return {
      success: true,
      data: {
        user: userData,
        role: roleData,
        isNewUser: !existingUser,
      },
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export const editFaculty = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const academicYear = formData.get("academicYear") as string
    const division = formData.get("division") as string

    const subjectIds: string[] = []
    let index = 0
    while (formData.has(`subjectIds[${index}]`)) {
      const subjectId = formData.get(`subjectIds[${index}]`) as string
      if (subjectId) {
        subjectIds.push(subjectId)
      }
      index++
    }

    if (subjectIds.length === 0) {
      return { success: false, error: "At least one subject must be selected" }
    }

    const supabase = await createClient()

    const { data: currentRole, error: getCurrentError } = await supabase
      .from("user_role")
      .select("user_id, depart_id")
      .eq("id", id)
      .single()

    if (getCurrentError) {
      return { success: false, error: getCurrentError.message }
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .update({
        name,
        email,
      })
      .eq("auth_id", currentRole.user_id)
      .select("*")
      .single()

    if (userError) {
      return { success: false, error: userError.message }
    }

    const { error: deleteError } = await supabase
      .from("user_role")
      .delete()
      .eq("user_id", currentRole.user_id)
      .eq("role_name", "Faculty")
      .eq("depart_id", currentRole.depart_id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Create new user_role entries for each selected subject
    const roleEntries = subjectIds.map((subjectId) => ({
      user_id: currentRole.user_id,
      role_name: "Faculty",
      depart_id: currentRole.depart_id,
      subject_id: subjectId,
      academic_year: academicYear,
      division,
    }))

    const { data: roleData, error: roleError } = await supabase.from("user_role").insert(roleEntries).select("*")

    if (roleError) {
      return { success: false, error: roleError.message }
    }

    return { success: true, data: { user: userData, roles: roleData } }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export const deleteFaculty = async (userAuthId: string) => {
  try {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    // First, delete all user_role entries for this user
    const { error: roleDeleteError } = await supabase.from("user_role").delete().eq("user_id", userAuthId)

    if (roleDeleteError) {
      console.error("Error deleting user roles:", roleDeleteError)
      return { success: false, error: roleDeleteError.message }
    }

    // Delete from users table
    const { error: userDeleteError } = await supabase.from("users").delete().eq("auth_id", userAuthId)

    if (userDeleteError) {
      console.error("Error deleting from users table:", userDeleteError)
      return { success: false, error: userDeleteError.message }
    }

    // Delete from Supabase Auth using admin client
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userAuthId)

    if (authDeleteError) {
      console.error("Error deleting from auth:", authDeleteError)
      return { success: false, error: authDeleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Helper function to delete a single faculty role (not the entire user)
export const deleteFacultyRole = async (roleId: string) => {
  try {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const { data: roleData, error: getRoleError } = await supabase
      .from("user_role")
      .select("user_id")
      .eq("id", roleId)
      .single()

    if (getRoleError) {
      return { success: false, error: getRoleError.message }
    }

    // Delete the specific role
    const { error: roleDeleteError } = await supabase.from("user_role").delete().eq("id", roleId)

    if (roleDeleteError) {
      return { success: false, error: roleDeleteError.message }
    }

    const { data: otherRoles, error: checkRolesError } = await supabase
      .from("user_role")
      .select("id")
      .eq("user_id", roleData.user_id)

    if (checkRolesError) {
      return { success: false, error: checkRolesError.message }
    }

    if (otherRoles.length === 0) {
      // Delete from users table
      const { error: userDeleteError } = await supabase.from("users").delete().eq("auth_id", roleData.user_id)

      if (userDeleteError) {
        console.error("Error deleting from users table:", userDeleteError)
      }

      // Delete from auth using admin client
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(roleData.user_id)

      if (authDeleteError) {
        console.error("Error deleting from auth:", authDeleteError)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}