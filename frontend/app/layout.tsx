import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { Provider } from "@/components/provider";

const JetBrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-VariableFont.ttf",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Devtoolz",
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
            <main className={`min-h-screen bg-[#111113] text-xs text-zinc-300`}>
              {children}
            </main>
          </Provider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
