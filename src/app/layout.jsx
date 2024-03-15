"use client"
import Header from "@/components/header";
import SideBar from "@/components/SideBar";
import { usePathname  } from 'next/navigation';

import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
    const isSignup = pathname === '/signup';
  const isSignin = pathname === '/';
  
  const renderHeaderAndSidebar =  !isSignup && !isSignin;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
      {renderHeaderAndSidebar && (
          <>
            <Header />
            <SideBar />
          </>
        )}
        <main className="ml-60 pt-16 max-h-screen overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
