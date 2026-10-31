import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Boarding House Finder - Philippines",
  description: "Find the best and most affordable boarding houses in the Philippines.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}