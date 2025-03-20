"use client";

import "./globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import TimerProvider from "./TimerContext";
import Theme from "./lib/theme";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from './AuthContext';
import NavigationBar from './components/NavigationBar'


function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className={`flex flex-col w-full justify-center items-start ${pathname === "/" || pathname === "" ? "" : "md:p-2 md:pl-0 md:shadow-lg"} pl-0 bg-[var(--foreground)]`}
    >
      <main className="flex-grow w-full">{children}</main>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {

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
          <AuthProvider>
            <TimerProvider>
              <NavigationBar />
              <LayoutContent>{children}</LayoutContent>
            </TimerProvider>
          </AuthProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
