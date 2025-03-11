'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
// import Image from 'next/image';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      {user && (
        <div className="p-10 text-center flex flex-col justify-center w-auto min-w-1/2 items-center bg-white bg-opacity-30 rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h1 className="text-4xl">Welcome, {user.nickname ?? user.name}!</h1>
          <Link className="block text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg" href="/api/auth/logout">Logout</Link>
        </div>
      )}
      {!user && (
        <div className="p-10 m-10 text-center flex flex-col justify-center w-auto max-w-1/2 items-center bg-white bg-opacity-30 rounded-lg shadow-lg text-2xl h-auto text-black gap-4">
          <h3>TIMER&apos;s best experience is reserved for authenticated users.</h3>
          <Link className="w-auto text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg" href="/api/auth/login">Login</Link>
        </div>)}
    </div>
  );
}