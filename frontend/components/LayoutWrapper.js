"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function LayoutWrapper({ children, footerData }) {
  const pathname = usePathname();
  // Hide Navbar and Footer on login and read pages
  const isHiddenPage = pathname === "/login" || pathname.startsWith("/read/");

  return (
    <>
      {!isHiddenPage && <Navbar />}
      {children}
      {!isHiddenPage && <Footer footerData={footerData} />}
      <Script
        src="https://code.jquery.com/jquery-3.6.4.min.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("jQuery loaded successfully!")}
      />
    </>
  );
}
