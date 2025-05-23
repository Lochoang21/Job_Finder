import React from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import 'simplebar-react/dist/simplebar.min.css';
import { Flowbite, ThemeModeScript } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import "./css/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobFinder - Tìm việc làm hàng đầu Việt Nam",
  description: "Nền tảng tìm kiếm việc làm hàng đầu Việt Nam, kết nối nhà tuyển dụng và ứng viên.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className={`${manrope.className}`}>
        <Flowbite theme={{ theme: customTheme }}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Flowbite>
      </body>
    </html>
  );
}