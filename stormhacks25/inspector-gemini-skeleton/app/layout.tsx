import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inspector Gemini",
  description: "A detective game powered by Gemini",
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
