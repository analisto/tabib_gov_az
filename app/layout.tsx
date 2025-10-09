import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "TemplateHub - Code Template Marketplace",
    template: "%s | TemplateHub"
  },
  description: "Discover, share, and showcase amazing code templates. Browse through a curated collection of templates for Next.js, React, and more.",
  keywords: ["code templates", "web templates", "react templates", "nextjs templates", "template marketplace", "code sharing"],
  authors: [{ name: "TemplateHub" }],
  creator: "TemplateHub",
  publisher: "TemplateHub",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "TemplateHub - Code Template Marketplace",
    description: "Discover, share, and showcase amazing code templates",
    siteName: "TemplateHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "TemplateHub - Code Template Marketplace",
    description: "Discover, share, and showcase amazing code templates",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
