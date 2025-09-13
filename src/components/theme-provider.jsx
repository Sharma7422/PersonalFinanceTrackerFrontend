"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"   // Tailwind will use class on <html>
      defaultTheme="light"
      enableSystem={true} // Optional: allow system preference
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
