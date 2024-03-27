"use client";
import Header from "@/components/header";
import SideBar from "@/components/SideBar";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Open_Sans, Roboto_Mono } from "next/font/google";
import clsx from "clsx";

const open_sans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  weight: "700",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const publicPages = ["/signup", "/", "/reset-password"];
  const isPublicPage = publicPages.includes(pathname);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(
        "h-full scroll-smooth antialiased",
        open_sans.variable,
        roboto_mono.variable
      )}
    >
      <head>
        <title>BCA Protocol app</title>
        <meta name="description" content="BCA Protocol app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180I hax180" href="/favicon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="flex flex-col h-full bg-black">
        {!isPublicPage && (
          <>
            <Header />
            <SideBar currentPath={pathname} />
            <main className="lg:pl-64">
              <div>{children}</div>
            </main>
          </>
        )}
        {isPublicPage && (
          <main>
            <div>{children}</div>
          </main>
        )}
      </body>
    </html>
  );
}
