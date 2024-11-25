"use client";

import { Suspense } from "react";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { Toaster } from "@/components/ui/toaster";

export function Provider({ children, ...props }: ThemeProviderProps) {
  return (
    <ApolloWrapper>
      <Suspense>
        {children}
        <Toaster />
      </Suspense>
    </ApolloWrapper>
  );
}
