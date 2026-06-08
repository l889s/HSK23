import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";
import { getNavItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "HSK الرئيسية v2 — تعلُّم اللغة الصينية",
  description:
    "مفردات HSK كاملة مع النطق الصوتي — تطبيق احترافي لتعلُّم اللغة الصينية للعرب",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "HSK", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = getNavItems();
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white">
        <ToastProvider>
          {children}
          <BottomNav items={navItems} />
        </ToastProvider>
      </body>
    </html>
  );
}
