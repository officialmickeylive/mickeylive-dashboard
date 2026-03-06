import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = { variable: "--font-inter", className: "" };
const rajdhani = { variable: "--font-rajdhani", className: "" };

export const metadata: Metadata = {
  title: "Spark Live Admin Dashboard",
  description: "Gaming-inspired admin dashboard for live streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, rajdhani.variable, "font-sans", geist.variable)}>
      <body className="font-sans">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
