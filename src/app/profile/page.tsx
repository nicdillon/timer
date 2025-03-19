"use client";

import Link from "next/link";
import { Paper, Button, CircularProgress } from "@mui/material";
import { getUser, signOut } from '../lib/supabaseClient'
import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js'
import useRouter from 'next/navigation'

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getUser();
        if (!data.user) {
          throw error
        } 
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [])

  

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--background)] md:rounded">
      <CircularProgress color="inherit" />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--background)] md:rounded">
      {user && (
        <Paper className="p-10 text-center flex flex-col justify-center w-auto min-w-1/2 items-center rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h1 className="text-4xl">Welcome, {user.email}!</h1>
          <p className="text-lg">User ID: {user.id}</p>
          <button 
            onClick={() => {
              signOut();
              useRouter.redirect('/auth/login')
            }}
            className="text-[var(--accent)] hover:text-[var(--accent)] rounded px-4 py-2 text-center"
          >
            Sign out
          </button>
        </Paper>
      )}
      {!user && (
        <Paper className="p-10 m-10 text-center flex flex-col justify-center w-auto max-w-1/2 items-center rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h3>
            TIMER&apos;s best experience is reserved for authenticated users.
          </h3>
          <div className="flex flex-row gap-4 mt-4">
            <Link href="/auth/login">
              <Button
                variant="contained"
                className="bg-[var(--accent)] hover:bg-[var(--accent)] border-none rounded px-4 py-2 text-center shadow-lg"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="outlined"
                className="border-[var(--accent)] text-[var(--accent)] hover:border-[var(--accent)] rounded px-4 py-2 text-center shadow-lg"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </Paper>
      )}
    </div>
  );
}
