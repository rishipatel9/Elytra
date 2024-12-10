"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import React from 'react';

// Explicitly type NextThemesProvider as a React component
const TypedNextThemesProvider = NextThemesProvider as React.ComponentType<ThemeProviderProps>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <TypedNextThemesProvider {...props}>{children}</TypedNextThemesProvider>;
}