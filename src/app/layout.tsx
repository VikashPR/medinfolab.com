import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "MINDH Laboratory | Medical Informatics & Digital Health",
    template: "%s | MINDH Laboratory",
  },
  description:
    "The Medical Informatics and Digital Health Laboratory studies clinical data, physiological signals, and digital health systems.",
  keywords: ["medical informatics", "digital health", "clinical research", "physiological signals"],
  openGraph: {
    title: "MINDH Laboratory",
    description: "Medical Informatics and Digital Health research.",
    type: "website",
    siteName: "MINDH Laboratory",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} font-sans`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
