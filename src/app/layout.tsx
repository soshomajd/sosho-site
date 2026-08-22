import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Vazirmatn, Orbitron } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImageUrl = new URL("/og.png", siteUrl).toString();

const siteName = "Sosho Studio";
const siteTitle = `${siteName} | Web Design, SEO, Web3 & AI`;
const siteDescription =
  "Sosho Studio delivers end-to-end web design and development, WordPress, SEO and Google growth, Web3 experiences, and practical AI integrations.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Sosho Studio",
    "web design studio",
    "web development",
    "WordPress design",
    "SEO services",
    "Google SEO",
    "Web3 development",
    "AI integration",
    "طراحی سایت",
    "طراحی سایت وردپرس",
    "سئو سایت",
    "طراحی وب ۳",
    "هوش مصنوعی",
  ],
  authors: [{ name: siteName, url: "/" }],
  creator: siteName,
  publisher: siteName,
  category: "Web design and digital services",
  alternates: {
    canonical: "/",
    languages: {
      fa: "/fa",
      en: "/en",
      "x-default": "/fa",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImageUrl, width: 1731, height: 909, alt: "Sosho Studio — Design, Technology & Growth" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0B0F14" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} ${orbitron.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
