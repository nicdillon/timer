'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';
import Link from 'next/link';
import Head from 'next/head';
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import TimerProvider from './TimerContext';
import TimerOverlay from './TimerOverlay';

function LayoutContent({ children }: { children: ReactNode }) {
  // Now always include TimerOverlay so it can animate between positions.

  return (
    <div className='flex flex-col md:flex-row'>
      <main className="flex-grow md:ml-1/4">{children}</main>
      <TimerOverlay />
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    });
  }

  return (
    <html lang="en">
      <Head>
        <title>TIMER</title>
        <link rel='icon' href='/TIMERLogo.svg' sizes="256x256" type="image/x-icon" />
      </Head>
      <UserProvider>
        <body className="bg-gradient-to-r from-black to-blue-900 min-h-screen flex flex-col">
          <TimerProvider>
            <nav className={`p-4 fixed top-0 left-0 w-1/3 md:full min-h-1/4 md:h-auto flex flex-col md:flex-row md:gap-4 md:bg-none md:shadow-none md:backdrop-blur-none z-50 ${menuOpen ? 'bg-white bg-opacity-20 backdrop-blur-md shadow-lg' : ''}`}>
              <div className="flex justify-between items-center md:hidden">
                <button type="button" onClick={toggleMenu} className="text-cyan-500 focus:outline-none">
                  {menuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                </button>
              </div>
              <ul className={`flex-col md:flex-row md:gap-4 w-full md:flex ${menuOpen ? 'flex' : 'hidden'}`}>
                <li className="mb-2 md:mb-0">
                  <Link href="/" title="Timer" onClick={() => setMenuOpen(false)} className={`flex justify-center items-center gap-2 ${pathname === '/' || pathname === '' ? 'text-cyan-900' : 'text-white'}  hover:text-cyan-700 border border-white rounded px-4 py-2 text-center bg-white bg-opacity-20 backdrop-blur-md shadow-lg`}>
                    <TimerIcon fontSize="large" />
                  </Link>
                </li>
                <li className="mb-2 md:mb-0">
                  <Link href="/analytics" onClick={() => setMenuOpen(false)} title="Analytics" className={`flex justify-center items-center gap-2 ${pathname === '/analytics' ? 'text-cyan-900' : 'text-white'}  hover:text-cyan-700 border border-white rounded px-4 py-2 text-center bg-white bg-opacity-20 backdrop-blur-md shadow-lg`}>
                    <AssessmentIcon fontSize="large" />
                  </Link>
                </li>
                <li className="mb-2 md:mb-0">
                  <Link href="/settings" onClick={() => setMenuOpen(false)} title="Settings" className={`flex justify-center items-center gap-2 ${pathname === '/settings' ? 'text-cyan-900' : 'text-white'}  hover:text-cyan-700 border border-white rounded px-4 py-2 text-center bg-white bg-opacity-20 backdrop-blur-md shadow-lg`}>
                    <SettingsApplicationsIcon fontSize="large" />
                  </Link>
                </li>
                <li className="mb-2 md:mb-0">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} title="Profile" className={`flex justify-center items-center gap-2 ${pathname === '/profile' ? 'text-cyan-900' : 'text-white'}  hover:text-cyan-700 border border-white rounded px-4 py-2 text-center bg-white bg-opacity-20 backdrop-blur-md shadow-lg`}>
                    <AccountBoxIcon fontSize="large" />
                  </Link>
                </li>
              </ul>
            </nav>
            <LayoutContent>{children}</LayoutContent>
          </TimerProvider>
        </body>
      </UserProvider>
    </html>
  );
}