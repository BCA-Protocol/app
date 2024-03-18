"use client";
import Header from "@/components/header";
import SideBar from "@/components/SideBar";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";
  const isSignin = pathname === "/";

  const renderHeaderAndSidebar = !isSignup && !isSignin;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bgprim">
          {renderHeaderAndSidebar && (
            <>
              <Header />
              <SideBar currentPath={pathname} />
            </>
          )}
          <main className="lg:ml-60 ">{children}</main>
      </body>
    </html>
  );
}
