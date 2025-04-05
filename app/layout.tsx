import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { LanguageProvider } from './context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '月经跟踪器',
  description: '追踪您的月经周期、症状和健康',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen pt-4">{children}</main>
          <footer className="bg-gray-50 border-t py-6 mt-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center text-gray-500 text-sm">
                <p>© 2025 Menstrual Calendar</p>
                <p className="mt-1">Health Data Tracking App · Protect Your Privacy</p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}