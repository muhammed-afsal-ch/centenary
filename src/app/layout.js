import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Anek_Malayalam } from 'next/font/google';

const anek = Anek_Malayalam({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
  variable: '--font-anek',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Samastha Centenary",
  description: "A platform for sharing and celebrating the centenary of Samastha",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
