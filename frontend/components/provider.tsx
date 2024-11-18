"use client";

import * as React from "react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Provider({ children, ...props }: ThemeProviderProps) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ConvexAuthNextjsProvider>
  );
}
