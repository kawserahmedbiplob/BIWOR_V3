import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import ThemeStyles from "@/components/ThemeStyles";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings() as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const title = s.metaTitle || s.companyName || "BIWORSOURCING";
  const description = s.metaDescription || "";
  const ogImage = s.ogImage
    ? s.ogImage.startsWith("http")
      ? s.ogImage
      : `${siteUrl}${s.ogImage}`
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${s.companyName || "BIWORSOURCING"}`,
    },
    description,
    keywords: s.metaKeywords
      ? String(s.metaKeywords).split(",").map((k: string) => k.trim())
      : undefined,
    authors: [{ name: s.companyName || "BIWORSOURCING" }],
    creator: s.companyName,
    publisher: s.companyName,
    robots: s.robotsIndex === false
      ? { index: false, follow: false }
      : {
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
    alternates: {
      canonical: siteUrl,
    },
    icons: s.favicon ? [{ url: s.favicon }] : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: s.companyName || "BIWORSOURCING",
      title,
      description,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: s.twitterHandle || undefined,
      site: s.twitterHandle || undefined,
    },
    other: {
      ...(s.facebookAppId ? { "fb:app_id": s.facebookAppId } : {}),
    },
    category: "business",
    verification: {
      // Add codes in admin later if needed; placeholders ignored when empty
      google: undefined,
      other: {
        "ai-content": "human-created-business-website",
      },
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const s = getSettings() as any;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <ThemeStyles />
        <JsonLd />
        {s.facebookAppId && <meta property="fb:app_id" content={s.facebookAppId} />}
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
        <Analytics />
        <CookieConsent
          enabled={s.cookieConsentEnabled !== false}
          text={s.cookieConsentText}
          privacyUrl={`${(s.siteUrl || "").replace(/\/$/, "")}/#contact`}
        />
      </body>
    </html>
  );
}
