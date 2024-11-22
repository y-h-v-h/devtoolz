"use client";

import { useMemo } from "react";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  ssrExchange,
  UrqlProvider,
} from "@urql/next";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { Toaster } from "@/components/ui/toaster";

export function Provider({ children, ...props }: ThemeProviderProps) {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined",
    });
    const client = createClient({
      url: "http://localhost:8686/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, []);
  return (
    // <UrqlProvider client={client} ssr={ssr}>
    <NextThemesProvider {...props}>
      <ApolloWrapper>{children}</ApolloWrapper>
      <Toaster />
    </NextThemesProvider>
    // </UrqlProvider>
  );
}
