import type { Metadata, Viewport } from "next";
import { DM_Sans, Dela_Gothic_One } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const heading = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const body = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "kcal",
  description: "Meals matched to your body and goal, delivered daily.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2a4932",
};

/**
 * Root layout shared by every page.
 * @param props - Layout props with the page content.
 * @returns The HTML document shell.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
