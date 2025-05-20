import { AuthProvider } from "@/lib/AuthContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "../actions/auth";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Authentication error or user not found:", authError);
    return null;
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    return null;
  }

  const { data: roleData, error: roleError } = await supabase
    .from("user_role")
    .select("*, departments(*, institutes(*))")
    .eq("user_id", user.id);

  if (roleError || !roleData) {
    console.error("Error fetching role data:", roleError);
    return null;
  } 

  return (
    <AuthProvider>
      <DashboardProvider value={{ userData, roleData }}>
        <div className="flex h-screen bg-gray-100">
          <CollapsibleSidebar signOut={signOut} />
          <main className="flex-1 overflow-y-auto p-5 transition-all duration-300">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </AuthProvider>
  );
}