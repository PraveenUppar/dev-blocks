import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Mrs_Sheppards,
  Google_Sans_Code,
  Montserrat,
  Arimo,
  Raleway,
} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mrsSheppards = Mrs_Sheppards({
  weight: "400",
  variable: "--font-mrs-sheppards",
  subsets: ["latin"],
});

const googleSansCode = Google_Sans_Code({
  weight: "300",
  variable: "--font-google-sans-code",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: "400",
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const arimo = Arimo({
  weight: "400",
  variable: "--font-arimo",
  subsets: ["latin"],
});

const raleway = Raleway({
  weight: "400",
  variable: "--font-arimo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Blocks",
  description: "A Medium-like blogging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${mrsSheppards.variable} ${googleSansCode.variable} ${montserrat.variable} ${arimo.variable} ${raleway.variable} bg-gray-50`}
        >
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
