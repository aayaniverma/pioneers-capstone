import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ParallaxClientProvider from "../components/ParallaxClientProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LEXENATE",
  description: "Your App Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ParallaxClientProvider>
          {children}
        </ParallaxClientProvider>
      </body>
    </html>
  );
}
