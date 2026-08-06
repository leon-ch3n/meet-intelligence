import type { Metadata } from "next";
import { Roboto, Roboto_Flex } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";

// Roboto is what every Google surface uses for body — 400/500/700 covers UI
// and text; Roboto Flex is the modern variable stand-in for Google Sans on
// display text (wordmark, page titles). Both self-host via next/font.
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Google Meet",
  description:
    "Permission-aware organizational memory across meetings, decisions, and follow-ups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoFlex.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <TooltipProvider delayDuration={200}>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
