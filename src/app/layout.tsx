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
          <main className="ml-64 mt-14 min-h-[calc(100vh-3.5rem)]">
            {children}
          </main>
          {/* Footer */}
          <footer className="ml-64 border-t border-cyan-500/10 bg-[#0d1117]/50 py-4 px-6">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-cyan-400">UrbanPulse</span>
                <span>•</span>
                <span>AI-Powered Mobile Urban Intelligence Platform</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Smart India Hackathon 2026</span>
                <span>•</span>
                <span>Problem Statement 26124</span>
                <span>•</span>
                <span>Team UrbanPulse</span>
              </div>
            </div>
          </footer>
        </SimulationProvider>
      </body>
    </html>
  );
}
