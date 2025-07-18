import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fontsource/inter/';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";
import ReduxProvider from "@/store/Provider";
import { Toaster as Sonner } from "@/components/ui2/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Toaster2 } from "@/components/ui2/toaster";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emotions AI",
  description: "Your mental wellness companion",
  icons: "https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png" type="image/x-icon" />
        <link rel="shortcut icon" href="https://res.cloudinary.com/dxae5w6hn/image/upload/v1744625275/azyl7octqwqctc1tipgb.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ReduxProvider>
          <TooltipProvider>
            <Toaster2 />
            <Sonner />
            {children}
            <Toaster />
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
