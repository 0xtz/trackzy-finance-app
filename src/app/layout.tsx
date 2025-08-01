import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import AppProviders from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trackzy — Smarter Money Management",
  description:
    "Track your spending, build healthy financial habits, and reach your goals — all in one place with Trackzy.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${geist.variable} antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <NextTopLoader color="var(--secondary)" showSpinner={false} />
        <AppProviders>{children}</AppProviders>

        <Toaster richColors />
      </body>
    </html>
  );
}
