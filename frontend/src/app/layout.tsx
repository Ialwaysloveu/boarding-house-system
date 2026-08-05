import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boarding House Finder - Philippines",
  description: "Find the best and most affordable boarding houses in the Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <nav style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>BH Finder</h1>
            <div>
              <a href="/login" style={{ marginRight: '1rem', fontWeight: 500 }}>Login</a>
              <a href="/register" className="btn btn-primary">Sign Up</a>
            </div>
          </div>
        </nav>
        <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
