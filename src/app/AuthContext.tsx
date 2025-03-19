// "use client";

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const supabase = createClientComponentClient();

//   useEffect(() => {
//     const getSession = async () => {
//       try {
//         const user = await supabase.auth.getUser();
//         setUser(user.data?.user || null);
//       } catch (error) {
//         console.error("Error getting session:", error);
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     getSession();

//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//         setIsLoading(false);
        
//         // Refresh the page to update server-side data
//         if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
//           router.refresh();
//         }
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase, router]);

//   const signIn = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         throw error;
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signUp = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/api/auth/callback`,
//         },
//       });

//       if (error) {
//         throw error;
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signOut = async () => {
//     setIsLoading(true);
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) {
//         throw error;
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         signIn,
//         signUp,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
