import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "服薬管理アプリ",
  description: "高齢者向け服薬管理システム - お薬の飲み忘れを防ぎます",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased pb-20">
        {children}
        <Navigation />
      </body>
    </html>
  );
}
