import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Ecosystem Alerts",
  description: "Stay ahead of Base blockchain ecosystem events, opportunities, and updates. One-click calendar export.",
  openGraph: {
    title: "Base Ecosystem Alerts",
    description: "Stay ahead of Base blockchain ecosystem events, opportunities, and updates.",
    siteName: "Base Ecosystem Alerts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
