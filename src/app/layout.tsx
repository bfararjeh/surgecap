import type { Metadata } from "next";
import { Google_Sans_Flex, JetBrains_Mono, Orbitron } from "next/font/google"
import Sparks from "@/src/components/Sparks"
import "./globals.css";
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
})

export const metadata: Metadata = {
  title: "SurgeCap",
  description: "A game about charging batteries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Sparks />
        {children}
        <footer>
          <a href="/about" >About</a>
          <a href="/" >Home</a>
          <a href="/help" >Rules</a>
        </footer>
      </body>
    </html>
  );
}
