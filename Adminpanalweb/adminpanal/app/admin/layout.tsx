import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@fontsource/inter/';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import Navbar from "@/components/Navbar";
import Topbar from "@/components/Topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <>
      <Topbar />
      <Navbar />
      {children}
    </>

  );
}
