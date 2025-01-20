'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { Raleway, Londrina_Sketch } from "next/font/google";
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

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const londrinaSketch = Londrina_Sketch({
  variable: "--font-londrina-sketch",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${londrinaSketch.variable} antialiased`}
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
