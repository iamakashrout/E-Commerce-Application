'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css';

import { Providers } from "./redux/providers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import { setDarkMode } from "./redux/features/themeSlice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.themeState.darkMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      dispatch(setDarkMode(savedTheme === 'true'));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Londrina+Sketch&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
