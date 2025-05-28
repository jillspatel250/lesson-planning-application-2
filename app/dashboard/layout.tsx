import type { Metadata } from "next";
import { Manrope } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope', 
  weight: ['400', '500', '600', '700'], 
})

export const metadata: Metadata = {
  title: "Lesson Planner Portal",
  description: "Lesson Planner Portal",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.className} antialiased`} >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}