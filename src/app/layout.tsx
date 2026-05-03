import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Toaster } from "sonner";
import { LoginIncentiveModal } from "@/components/LoginIncentiveModal";
import { LoadingBar } from "@/components/LoadingBar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "One Tap AI Diagnose | Premium Healthcare",
  description: "Instant clinical triage and doctor connections powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MedicalBackground />
          <Suspense fallback={null}>
            <LoadingBar />
            <LoginIncentiveModal />
          </Suspense>
          <Toaster richColors position="top-right" closeButton />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
