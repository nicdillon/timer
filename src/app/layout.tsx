"use client";

import "./globals.css";
import Link from "next/link";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TimerIcon from "@mui/icons-material/Timer";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import TimerProvider from "./TimerContext";
import Theme from "./lib/theme";
import { ThemeProvider } from "@mui/material/styles";
import { User } from '@supabase/supabase-js'
import { getUser } from './lib/supabaseClient'


function LayoutContent({ children }: { children: ReactNode }) {
  // Now always include TimerOverlay so it can animate between positions.

  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col w-full justify-center items-start ${pathname === "/" || pathname === "" ? "" : "md:p-2 md:shadow-lg pl-0"} bg-[var(--foreground)]`}
    >
      <main className="flex-grow w-full">{children}</main>
      {/* <TimerOverlay /> */}
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getUser();
        if (error) throw error;
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [])

  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    });
  }

  return (
    <html lang="en">
      <Head>
        <title>TIMER</title>
        <link
          rel="icon"
          href="/TIMERLogo.svg"
          sizes="256x256"
          type="image/x-icon"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <ThemeProvider theme={Theme}>
        <body className="min-h-screen flex flex-row w-full">
          <TimerProvider>
            <nav
              className={`p-4 ${pathname === "/" ? "hidden" : "flex"} sticky md:w-20 top-0 h-screen md:h-screen flex-col md:gap-4 md:bg-[var(--foreground)] md:backdrop-blur-md z-50 ${menuOpen ? "bg-[var(--foreground)]  backdrop-blur-md shadow-lg" : ""}`}
            >
              {/* <img src='/TIMERLogo.svg' className='w-auto h-16 object-conatain' height={64} width={64}></img> */}
              <div className="flex justify-between items-center md:hidden">
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="text-[var(--accent)] focus:outline-none"
                >
                  {menuOpen ? (
                    <div></div> // <CloseIcon fontSize="large" />
                  ) : (
                    <MenuIcon fontSize="large" />
                  )}
                </button>
              </div>
              <ul
                className={`flex flex-col md:flex-col md:gap-4 w-auto h-full md:flex ${menuOpen ? "flex" : "hidden"}`}
              >
                <li className="mb-2 md:mb-0">
                  <Link
                    href="/timer"
                    title="Timer"
                    onClick={() => setMenuOpen(false)}
                    className={`flex justify-center items-center ${pathname !== "/timer" ? "text-[var(--background)]" : "text-[var(--accent)] bg-none"} hover:text-[var(--accent)] border border-none rounded p-1 text-center backdrop-blur-md shadow-lg`}
                  >
                    <TimerIcon fontSize="large" />
                  </Link>
                </li>
                <li className="mb-2 md:mb-0">
                  <Link
                    href="/analytics"
                    onClick={() => setMenuOpen(false)}
                    title="Analytics"
                    className={`flex justify-center items-center ${pathname !== "/analytics" ? "text-black bg-white" : "text-[var(--accent)] bg-none"}  hover:text-[var(--accent)] border border-none rounded p-1 text-center  backdrop-blur-md shadow-lg`}
                  >
                    <AssessmentIcon fontSize="large" />
                  </Link>
                </li>
                {/* <li className="mb-2 md:mb-0">
                  <Link href="/settings" onClick={() => setMenuOpen(false)} title="Settings" className={`flex justify-center items-center gap-2 ${pathname === '/settings' ? 'text-black' : 'text-white'}  hover:text-[var(--accent)] border border-none rounded px-4 py-2 text-center bg-white  backdrop-blur-md shadow-lg`}>
                    <SettingsApplicationsIcon fontSize="large" />
                  </Link>
                </li> */}
                <li className="mb-2 md:mb-0">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    title="Profile"
                    className={`flex justify-center items-center ${pathname !== "/profile" ? "text-black bg-white" : "text-[var(--accent)] bg-none"}  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}
                  >
                    <AccountBoxIcon fontSize="large" />
                  </Link>
                </li>
              </ul>
              {user && <button
                onClick={async () => await fetch("/api/auth/signout", { method: 'POST' })}
                title="Signout"
                className={`md:flex justify-center items-center text-[var(--background)] ${menuOpen ? "block" : "hidden"} bg-none  hover:text-[var(--accent)] border border-none rounded p-1 text-center   backdrop-blur-md shadow-lg`}
              >
                <LogoutIcon fontSize="large" />
              </button>}

            </nav>
            <LayoutContent>{children}</LayoutContent>
          </TimerProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
