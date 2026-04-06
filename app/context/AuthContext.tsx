"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  session: Session | null;
  userRole: number | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole(userId: string) {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id_rol")
        .eq("auth_user_id", userId)
        .single();

      if (!error && data) {
        setUserRole(data.id_rol);
      } else {
        setUserRole(null);
      }
    }

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      if (current?.user.id) {
        fetchRole(current.user.id).then(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user.id) {
        setIsLoading(true);
        fetchRole(newSession.user.id).then(() => setIsLoading(false));
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, userRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
