import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/utils/react-query-provider";
import Header from "@/components/header";
import { Toaster } from "@/components/toast/toaster";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Tally",
  description:
    "Tally is a simple and easy to use self attendance tracker for students.",
  metadataBase: new URL("https://tally.ambe.dev"),
  appleWebApp: {
    title: "Tally",
    capable: true,
    statusBarStyle: "default"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <body
          className={`${inter.className} bg-primary text-primary flex min-h-dvh flex-col`}
        >
          <Toaster />
          <Analytics />
          <Header />
          {children}
        </body>
      </ReactQueryProvider>
    </html>
  );
}
