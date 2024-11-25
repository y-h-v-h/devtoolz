import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { Provider } from "@/components/provider";

const JetBrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-VariableFont.ttf",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Devtoolz",
  generator: "Next.js",
  applicationName: "Devtoolz",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript"],
  alternates: {},
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://devtoolz-app.vercel.app"),
  openGraph: {
    title: "devtoolz-app",
    description: "Devtools for you",
    url: "https://devtoolz-app.vercel.app",
    siteName: "devtoolz-app",
    images: [
      {
        url: "https://devtoolz-app.vercel.app/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "https://devtoolz-app.vercel.app/og-dark.png",
        width: 1800,
        height: 1600,
        alt: "Devtools for developers",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${JetBrainsMono.className}`}>
        <Provider attribute="class" defaultTheme="system" enableSystem>
          <main
            className={`app min-h-screen bg-[#111113] text-xs text-zinc-300`}
          >
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
