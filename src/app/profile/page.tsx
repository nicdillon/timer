"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { Paper } from "@mui/material";
// import Image from 'next/image';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[var(--background)] rounded">
      {user && (
        <Paper className="p-10 text-center flex flex-col justify-center w-auto min-w-1/2 items-cente rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h1 className="text-4xl">Welcome, {user.nickname ?? user.name}!</h1>
          <Link
            prefetch={false}
            className="block text-[var(--accent)] hover:text-[var(--accent)]  rounded px-4 py-2 text-center underline"
            href="/api/auth/logout"
          >
            Logout
          </Link>
        </Paper>
      )}
      {!user && (
        <Paper className="p-10 m-10 text-center flex flex-col justify-center w-auto max-w-1/2 items-cente rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h3>
            TIMER&apos;s best experience is reserved for authenticated users.
          </h3>
          <Link
            prefetch={false}
            className="w-auto bg-[var(--accent)] hover:bg-[var(--accent)] border-none border-[var(--accent)] rounded px-4 py-2 text-center backdrop-blur-md shadow-lg"
            href="/api/auth/login"
          >
            Login
          </Link>
        </Paper>
      )}
    </div>
  );
}
