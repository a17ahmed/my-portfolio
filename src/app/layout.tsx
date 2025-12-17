import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ahmed Irfan | Full Stack Developer",
    template: "%s | Ahmed Irfan",
  },
  description:
    "Full Stack Developer specializing in building exceptional digital experiences. Explore my portfolio of web applications, mobile apps, and innovative projects.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Portfolio",
    "Ahmed Irfan",
  ],
  authors: [{ name: "Ahmed Irfan" }],
  creator: "Ahmed Irfan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ahmedirfan.dev",
    siteName: "Ahmed Irfan Portfolio",
    title: "Ahmed Irfan | Full Stack Developer",
    description:
      "Full Stack Developer specializing in building exceptional digital experiences.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Irfan - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Irfan | Full Stack Developer",
    description:
      "Full Stack Developer specializing in building exceptional digital experiences.",
    images: ["/og-image.png"],
    creator: "@ahmedirfan",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background custom-scrollbar`}
      >
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
