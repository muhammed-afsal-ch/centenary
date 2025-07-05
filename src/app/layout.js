"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { Anek_Malayalam } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

const anek = Anek_Malayalam({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-anek",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${anek.variable} antialiased`}>
        {/* Head component for metadata */}
        <Head>
          <title>Samastha Centenary</title>
          <meta name="description" content="A platform for sharing and celebrating the centenary of Samastha" />
        </Head>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

// 👇 Client component to conditionally show Navbar/Footer
function ClientWrapper({ children }) {
  const pathname = usePathname();

  // Check if the current route starts with `/dashboard`
  const shouldHide = pathname.startsWith("/dashboard");

  return (
    <>
      {/* Conditionally render Navbar and Footer based on route */}
      {!shouldHide && <Navbar />}
      <main className={!shouldHide ? "pt-20 min-h-screen" : "min-h-screen"}>{children}</main>
      {!shouldHide && <Footer />}
    </>
  );
}
