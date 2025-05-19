"use client";

import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  profile_photo?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("id, auth_id, name, email, profile_photo")
          .eq("auth_id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        } else {
          setUser(userData as User);
        }
      } else {
        setUser(null);
        router.push("/auth/login");
      }

      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("id, auth_id, name, email, profile_photo")
            .eq("auth_id", session.user.id)
            .single();

          if (!error && userData) {
            setUser(userData as User);
          } else {
            console.error("Error fetching user on SIGNED_IN:", error);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          router.push("/auth/login");
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};