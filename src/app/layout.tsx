import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/StoreProvider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Spark Live Admin Dashboard',
  description: 'Gaming-inspired admin dashboard for live streaming platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen font-sans antialiased bg-dark-bg text-text-primary custom-scrollbar"
      )}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
