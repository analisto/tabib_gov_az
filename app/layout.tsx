import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "MVP Marketplace - Full-Stack Web Apps for Startups | Launch Faster",
    template: "%s | MVP Marketplace"
  },
  description: "Buy and sell production-ready full-stack web applications and MVPs. Launch your startup faster with battle-tested code. Browse Next.js, React, and SaaS templates from top developers.",
  keywords: [
    "mvp marketplace",
    "full-stack apps",
    "web applications",
    "startup code",
    "saas templates",
    "nextjs apps",
    "react apps",
    "production-ready code",
    "mvp templates",
    "startup templates",
    "code marketplace",
    "developer templates",
    "web app templates",
    "saas boilerplate"
  ],
  authors: [{ name: "MVP Marketplace", url: "https://www.mwp.codes" }],
  creator: "MVP Marketplace",
  publisher: "MVP Marketplace",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://www.mwp.codes"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MVP Marketplace - Full-Stack Web Apps for Startups | Launch Faster",
    description: "Buy and sell production-ready full-stack web applications and MVPs. Launch your startup faster with battle-tested code.",
    siteName: "MVP Marketplace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MVP Marketplace - Full-Stack Web Apps for Startups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MVP Marketplace - Full-Stack Web Apps for Startups | Launch Faster",
    description: "Buy and sell production-ready full-stack web applications and MVPs. Launch your startup faster with battle-tested code.",
    images: ["/twitter-image.png"],
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
  verification: {
    google: "your-google-verification-code",
    // Add your verification codes here
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MVP Marketplace",
              description: "Buy and sell production-ready full-stack web applications and MVPs",
              url: process.env.NEXTAUTH_URL || "https://www.mwp.codes",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXTAUTH_URL || "https://www.mwp.codes"}/templates?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
