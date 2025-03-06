import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Django CMS Github Actions Dashboard",
  description: "Monitor GitHub Actions workflows across your django-cms organization",
  authors: [{ name: "django CMS Association" }],
  creator: "django CMS Association",
  publisher: "django CMS Association",
  keywords: ["GitHub", "Actions", "Dashboard", "django CMS", "Workflows"],
  metadataBase: new URL("https://django-cms.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
