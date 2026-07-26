import type { Metadata } from "next";
import {
  Inter_Tight,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalmovement.uk"),
  title: "Digitec × Digital Movement | Digitales Wachstum",
  description:
    "LinkedIn-Automatisierung, SEO & GEO und Website-Entwicklung für Dr. B.-DIGITEC – klar auswählen und direkt zusammenstellen.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon-512.png",
  },
  openGraph: {
    title: "Digitec × Digital Movement",
    description:
      "Digitales Wachstum über LinkedIn, Google, KI-Suche und Website.",
    images: [
      {
        url: "/og-image-visibility-platforms.png",
        width: 1200,
        height: 630,
        alt: "Digitec × Digital Movement – digitales Wachstum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digitec × Digital Movement",
    description:
      "Digitales Wachstum über LinkedIn, Google, KI-Suche und Website.",
    images: ["/og-image-visibility-platforms.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
