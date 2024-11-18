import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Provider } from "@/components/provider";

const JetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2oolz",
  generator: "Next.js",
  applicationName: "2oolz",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Next.js",
    "React",
    "JavaScript",
    "Boilerplate",
    "Template",
    "shadcn-ui",
  ],
  alternates: {},
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://2oolz.vercel.app"),
  openGraph: {
    title: "200lz",
    description: "2oolz for you",
    url: "https://2oolz.vercel.app",
    siteName: "2oolz",
    images: [
      {
        url: "https://2oolz.vercel.app/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://2oolz.vercel.app/og-dark.png",
        width: 1800,
        height: 1600,
        alt: "Next.js, TailwindCSS and shadcn-ui Starter Template",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${JetBrainsMono.className}`}>
          <Provider attribute="class" defaultTheme="system" enableSystem>
            <main
              className={`bg-white text-xs text-zinc-700 dark:bg-black dark:text-zinc-400`}
            >
              {children}
            </main>
          </Provider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
