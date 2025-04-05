"use client";

import Link from 'next/link';
import { useLanguage } from '../app/context/LanguageContext';

export default function Navbar() {
  const { language } = useLanguage();

  return (
    <nav className="w-full bg-white shadow-sm mb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-pink-600 text-xl font-bold">
              {language === 'zh' ? '月经跟踪器' : 'Period Tracker'}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/pregnancy-calculator" 
              className="text-pink-600"
            >
              {language === 'zh' ? '妊娠期日历' : 'Pregnancy Calendar'}
            </Link>
            <Link 
              href="/sex-calculator" 
              className="text-pink-600"
            >
              {language === 'zh' ? '同房日历' : 'Sex Calendar'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}