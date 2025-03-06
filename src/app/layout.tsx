'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <html lang="en">
      <UserProvider>
        <body className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex flex-col">
          <nav className="p-4 fixed top-0 left-0 w-full md:w-1/4 h-full md:h-auto flex flex-col md:flex-row md:justify-around">
            <div className="flex justify-between items-center md:hidden">
              <button onClick={toggleMenu} className="text-purple-500 focus:outline-none">
                {menuOpen ? 'Close' : 'Nav'}
              </button>
            </div>
            <ul className={`flex-col md:flex-row md:justify-around w-full md:flex ${menuOpen ? 'flex' : 'hidden'}`}>
              <li className="mb-2 md:mb-0">
                <Link href="/" className="block text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
                  Timer
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/settings" className="block text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
                  Settings
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/profile" className="block text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
                  Profile
                </Link>
              </li>
              <li className="mb-2 md:mb-0">
                <Link href="/analytics" className="block text-purple-500 hover:text-purple-700 border border-purple-500 rounded px-4 py-2 text-center bg-white bg-opacity-30 backdrop-blur-md shadow-lg">
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>
          <main className="flex-grow md:mt-0 md:ml-1/4">{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}