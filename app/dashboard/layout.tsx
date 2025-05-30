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
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  const { data: roleData, error: roleError } = await supabase
    .from("user_role")
    .select("*, users(*), departments(*, institutes(*)), subjects(*)")
    .eq("user_id", userData.auth_id);

  if (userError || roleError || !userData || !roleData || roleData.length === 0) {
    return <div className="text-xl text-red-500 p-2">Error While Loading Dashboard</div>;
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
