import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "MVP Marketplace - Full-Stack Web Apps for Startups",
    template: "%s | MVP Marketplace"
  },
  description: "Buy and sell production-ready full-stack web applications and MVPs. Launch your startup faster with battle-tested code.",
  keywords: ["mvp", "full-stack apps", "web applications", "startup code", "saas templates", "nextjs apps", "react apps", "production-ready code"],
  authors: [{ name: "MVP Marketplace" }],
  creator: "MVP Marketplace",
  publisher: "MVP Marketplace",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://www.mwp.codes"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MVP Marketplace - Full-Stack Web Apps for Startups",
    description: "Buy and sell production-ready full-stack web applications and MVPs",
    siteName: "MVP Marketplace",
  },
  twitter: {
    card: "summary_large_image",
    title: "MVP Marketplace - Full-Stack Web Apps for Startups",
    description: "Buy and sell production-ready full-stack web applications and MVPs",
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
