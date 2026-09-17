import type { Metadata, Viewport } from "next";
import "../index.css";
import { SiteProviders } from "../components/SiteProviders";

export const metadata: Metadata = {
  title: "flask_to_node_js_0_edited_MINDH Lab",
  description:
    "Medical Informatics and Digital Health Laboratory (MINDH) — Translational clinical informatics, physiological monitoring, and clinical AI.",
  icons: {
    icon: "/vite.svg",
  },
  openGraph: {
    title: "flask_to_node_js_0_edited_MINDH Lab",
    description:
      "Medical Informatics and Digital Health Laboratory (MINDH) — Translational clinical informatics, physiological monitoring, and clinical AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#120609] text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
