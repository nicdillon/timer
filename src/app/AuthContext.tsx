"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "./lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const {data: { subscription }} = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (event === 'SIGNED_OUT') {
          setSession(null)
          toast.success("Signed Out", { autoClose: 1500})
        } else if (session) {
          setSession(session)
        }
      })

      setIsLoading(false)

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
