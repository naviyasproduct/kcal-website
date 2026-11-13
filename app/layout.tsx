import type { Metadata, Viewport } from "next";
import { DM_Sans, Dela_Gothic_One } from "next/font/google";
import "./globals.css";

const heading = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const body = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

/** Kept neutral: this is shared with the coming-soon page, so it must not describe the product. */
export const metadata: Metadata = {
  title: "kcal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#364635",
};

/**
 * Root document shell shared by the site and the coming-soon page.
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
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
