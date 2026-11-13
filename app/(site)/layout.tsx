import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";

export const metadata: Metadata = {
  description: "Meals matched to your body and goal, delivered daily.",
};

/**
 * Chrome for the real site: smooth scroll, header and footer.
 * Hidden behind the coming-soon page until launch (see proxy.ts).
 * @param props - Layout props with the page content.
 * @returns The page wrapped in header and footer.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
