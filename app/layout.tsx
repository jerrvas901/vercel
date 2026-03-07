import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Gervas Shukrani | Portfolio",
  description:
    "Portfolio website for Gervas Shukrani - web developer focused on modern, fast, and user-friendly products.",
  icons: {
    icon: "/site-logo.svg",
    shortcut: "/site-logo.svg",
    apple: "/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
