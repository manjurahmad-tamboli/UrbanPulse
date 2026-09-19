import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ToastContainer from "@/components/toast-container";
import PresentationHUD from "@/components/presentation-hud";
import { SimulationProvider } from "@/context/simulation-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UrbanPulse — AI-Powered Mobile Urban Intelligence Platform",
  description: "Converting public transport into mobile urban sensing infrastructure using Edge AI. Smart India Hackathon 2026 • PS-26124 • Bharat Electronics Limited",
  keywords: ["UrbanPulse", "Smart City", "AI", "Edge Computing", "Public Transport", "Urban Intelligence", "SIH 2026"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full bg-[#0a0e1a] text-gray-200">
        <SimulationProvider>
          <Sidebar />
          <Header />
          <PresentationHUD />
          <ToastContainer />
          <main className="lg:ml-64 ml-0 mt-14 min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
            {children}
          </main>
          {/* Footer */}
          <footer className="lg:ml-64 ml-0 border-t border-cyan-500/10 bg-[#0d1117]/50 py-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-cyan-400">UrbanPulse</span>
                <span>•</span>
                <span className="truncate">AI-Powered Mobile Urban Intelligence</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                <span>SIH 2026</span>
                <span>•</span>
                <span>PS-26124</span>
                <span>•</span>
                <span>BEL</span>
              </div>
            </div>
          </footer>
        </SimulationProvider>
      </body>
    </html>
  );
}
