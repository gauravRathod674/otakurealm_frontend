import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
r;
import Footer from "@/components/Footer";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OtakuRealm",
  description:
    "OtakuRealm is an anime streaming and manga reading site with many features like chatbot and personal recommnedions.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// Static footer data
const footerData = [
  { text: "All", url: "/az-list" },
  { text: "#", url: "/az-list/other" },
  { text: "0-9", url: "/az-list/0-9" },
  { text: "A", url: "/az-list/A" },
  { text: "B", url: "/az-list/B" },
  { text: "C", url: "/az-list/C" },
  { text: "D", url: "/az-list/D" },
  { text: "E", url: "/az-list/E" },
  { text: "F", url: "/az-list/F" },
  { text: "G", url: "/az-list/G" },
  { text: "H", url: "/az-list/H" },
  { text: "I", url: "/az-list/I" },
  { text: "J", url: "/az-list/J" },
  { text: "K", url: "/az-list/K" },
  { text: "L", url: "/az-list/L" },
  { text: "M", url: "/az-list/M" },
  { text: "N", url: "/az-list/N" },
  { text: "O", url: "/az-list/O" },
  { text: "P", url: "/az-list/P" },
  { text: "Q", url: "/az-list/Q" },
  { text: "R", url: "/az-list/R" },
  { text: "S", url: "/az-list/S" },
  { text: "T", url: "/az-list/T" },
  { text: "U", url: "/az-list/U" },
  { text: "V", url: "/az-list/V" },
  { text: "W", url: "/az-list/W" },
  { text: "X", url: "/az-list/X" },
  { text: "Y", url: "/az-list/Y" },
  { text: "Z", url: "/az-list/Z" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* ✅ Boxicons for icons */}
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#191919" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap content with LayoutWrapper */}
        <LayoutWrapper footerData={footerData}>{children} </LayoutWrapper>
        {/* Pass static footer data to Footer component */}
      </body>
    </html>
  );
}
