import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";

// 懒加载组件
const Navbar = React.lazy(() => import("./components/Navbar"));
const Footer = React.lazy(() => import("./components/Footer"));

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "现代程序员作品集",
  description: "展示我的编程项目和专业技能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased gradient-bg min-h-screen`}
      >
        <Suspense fallback={<div className="h-16 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800" />}>
          <Navbar />
        </Suspense>
        <main className="container mx-auto px-4 py-8 fade-in">
          {children}
        </main>
        <Suspense fallback={<div className="h-32 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800" />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
