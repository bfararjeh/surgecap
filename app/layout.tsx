import type { Metadata } from "next";
import { Google_Sans_Flex, JetBrains_Mono } from "next/font/google"
import "./globals.css";

const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans"
})

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
    <html lang="en" className={`${googleSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <footer>
          <a href="/" >Home</a>
          <a href="/about" >About</a>
        </footer>
      </body>
    </html>
  );
}
