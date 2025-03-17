'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';
import Link from 'next/link';
import Head from 'next/head';
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react';
// import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import TimerProvider from './TimerContext';
import TimerOverlay from './TimerOverlay';
import Theme from './lib/theme';
import { ThemeProvider } from '@mui/material/styles';

function LayoutContent({ children }: { children: ReactNode }) {
  // Now always include TimerOverlay so it can animate between positions.

  return (
    <div className='flex flex-col md:flex-row w-full'>
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
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet"></link>
      </Head>
      <UserProvider>
        <ThemeProvider theme={Theme}>
          <body className="min-h-screen flex flex-row w-screen">
            <TimerProvider>
              <nav className={`p-4 sticky top-0 h-full w-auto md:h-screen flex flex-col md:gap-4 md:bg-none md:shadow-none md:backdrop-blur-none z-50 ${menuOpen ? 'bg-white  backdrop-blur-md shadow-lg' : ''}`}>
                {/* <img src='/TIMERLogo.svg' className='w-auto h-16 object-conatain' height={64} width={64}></img> */}
                <div className="flex justify-between items-center md:hidden">
                  <button type="button" onClick={toggleMenu} className="text-[var(--accent)] focus:outline-none">
                    {menuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                  </button>
                </div>
                <ul className={`flex md:flex-col md:gap-4 w-auto h-full md:flex ${menuOpen ? 'flex' : 'hidden'}`}>
                  <li className="mb-2 md:mb-0">
                    <Link href="/" title="Timer" onClick={() => setMenuOpen(false)} className={`flex justify-center items-center ${pathname === '/' || pathname === '' ? 'text-black bg-white' : 'text-white bg-none'}  hover:text-[var(--accent)] border border-none rounded p-1 text-center  backdrop-blur-md shadow-lg`}>
                      <TimerIcon fontSize="large" />
                    </Link>
                  </li>
                  <li className="mb-2 md:mb-0">
                    <Link href="/analytics" onClick={() => setMenuOpen(false)} title="Analytics" className={`flex justify-center items-center ${pathname === '/analytics' ? 'text-black bg-white' : 'text-white bg-none'}  hover:text-[var(--accent)] border border-none rounded p-1 text-center  backdrop-blur-md shadow-lg`}>
                      <AssessmentIcon fontSize="large" />
                    </Link>
                  </li>
                  {/* <li className="mb-2 md:mb-0">
                  <Link href="/settings" onClick={() => setMenuOpen(false)} title="Settings" className={`flex justify-center items-center gap-2 ${pathname === '/settings' ? 'text-black' : 'text-white'}  hover:text-[var(--accent)] border border-none rounded px-4 py-2 text-center bg-white  backdrop-blur-md shadow-lg`}>
                    <SettingsApplicationsIcon fontSize="large" />
                  </Link>
                </li> */}
                  <li className="mb-2 md:mb-0">
                    <Link href="/profile" onClick={() => setMenuOpen(false)} title="Profile" className={`flex justify-center items-center ${pathname === '/profile' ? 'text-black bg-white' : 'text-white bg-none'}  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}>
                      <AccountBoxIcon fontSize="large" />
                    </Link>
                  </li>
                </ul>
                <Link prefetch={false} href="/api/auth/logout" onClick={() => setMenuOpen(false)} title="Logout" className={`flex justify-center items-center 'text-white bg-none'  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}>
                  <LogoutIcon fontSize="large" />
                </Link>
              </nav>
              <LayoutContent>{children}</LayoutContent>
            </TimerProvider>
          </body>
        </ThemeProvider>
      </UserProvider>
    </html>
  );
}