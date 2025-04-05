"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// 添加日历上下文类型
interface CalendarContextType {
  currentViewMonth: Date;
  setCurrentViewMonth: (date: Date) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
// 创建日历上下文
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // 从 localStorage 获取保存的语言设置
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      return (savedLanguage as Language) || 'en';
    }
    return 'en';
  });

  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 创建日历提供器
export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentViewMonth, setCurrentViewMonth] = useState<Date>(() => {
    // 默认使用当前月份
    return new Date();
  });

  const value = {
    currentViewMonth,
    setCurrentViewMonth
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// 添加使用日历上下文的hook
export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
} 