"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { useLanguage, useCalendar } from '../context/LanguageContext';
import { Waves } from '../../components/ui/waves-background';

interface SexRecord {
  date: Date;
  note?: string;
}

interface PeriodData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
  ovulationDay?: number;
  ovulationStart?: number;
  ovulationEnd?: number;
  futureCycles: {
    periodStart: string;
    ovulationDate: string;
  }[];
}

interface Translations {
  title: string;
  subtitle: string;
  addRecord: string;
  date: string;
  note: string;
  save: string;
  records: string;
  probability: string;
  noRecords: string;
  delete: string;
  edit: string;
  cancel: string;
  probabilityExplanation: string;
  periodProbability: string;
  ovulationProbability: string;
  safePeriodProbability: string;
  addNote: string;
  clearDate: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  setupPeriodFirst: string;
  setupPeriodFirstDesc: string;
  goToPeriodCalculator: string;
  ovulationDay: string;
  ovulationPeriod: string;
  periodDays: string;
  safePeriod: string;
  articles: {
    title: string;
    items: {
      id: string;
      title: string;
      content: string;
    }[];
  };
}

export default function SexCalendar() {
  const { language, setLanguage } = useLanguage();
  const { currentViewMonth, setCurrentViewMonth } = useCalendar();
  const [records, setRecords] = useState<SexRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [periodData, setPeriodData] = useState<PeriodData | null>(null);
  const [hasPeriodData, setHasPeriodData] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const translations: { en: Translations; zh: Translations } = {
    en: {
      title: 'Sex Calendar',
      subtitle: 'Track your intimate moments and calculate pregnancy probability',
      addRecord: 'Add Record',
      date: 'Date',
      note: 'Note (optional)',
      save: 'Save',
      records: 'Records',
      probability: 'Pregnancy Probability',
      noRecords: 'No records yet',
      delete: 'Delete',
      edit: 'Edit',
      cancel: 'Cancel',
      probabilityExplanation: 'Pregnancy probability is calculated based on your menstrual cycle data',
      periodProbability: 'During period: 3%',
      ovulationProbability: 'Ovulation period: 38% - 71% (peak on ovulation day)',
      safePeriodProbability: 'Safe period: 5% - 26% (varies by day)',
      addNote: 'Add Note',
      clearDate: 'Clear Date',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
      setupPeriodFirst: 'Set Up Your Period Data First',
      setupPeriodFirstDesc: 'To calculate pregnancy probability, please set up your period data in the Period Calculator page.',
      goToPeriodCalculator: 'Go to Period Calculator',
      ovulationDay: 'Ovulation Day',
      ovulationPeriod: 'Ovulation Period',
      periodDays: 'Period Days',
      safePeriod: 'Safe Period',
      articles: {
        title: 'Knowledge Base',
        items: [
          {
            id: 'maximize-conception',
            title: 'Maximizing Conception Chances with Sex Calendar',
            content: `
Key Findings: Scientific timing increases pregnancy probability by 3-8 folds

1. Ovulation Window Targeting
- Golden 6-Day Rule: Probability gradient from 3% (5 days pre-ovulation) to 35% (1 day pre-ovulation)
- Sperm Survival Advantage: Intercourse 1-2 days before ovulation allows sperm to wait in fallopian tubes

2. Multi-Method Tracking
- Triangulation of BBT + Cervical Mucus + LH Strips (92% accuracy)
- Smart Device Integration: Apple Watch nocturnal temp monitoring (±0.1℃)

3. Optimal Intercourse Formula

| Window Days | Recommended Sessions |
| 6 days | 4-5 times |
| 5 days | 3-4 times |
| 4 days | 3 times |

4. Special Populations
- Irregular Cycles: Overlapping 3-cycle analysis
- Advanced Maternal Age: Focus on 24h pre-ovulation + CoQ10 supplementation`
          },
          {
            id: 'dual-mode-calendar',
            title: 'Dual-Mode Sex Calendar: Contraception & Conception',
            content: `
Mode Switching Logic:

1. Contraception Mode
- Dynamic Safe Period Algorithm: Combines calendar method (±2d error) & BBT confirmation
- Risk Alert: 25% failure rate reminder on predicted safe days

2. Conception Mode
- Probability Heatmap: Historical data-driven optimal days
- Sperm Quality Tips: 48h intercourse intervals

3. Mixed Mode Example

| Phase | Mode | Color Code | Features |
| First Half | Contraception | Gray | Safe period prediction |
| Post-Ovulation | Conception | Green | Fertility optimization |`
          }
        ]
      }
    },
    zh: {
      title: '同房日历',
      subtitle: '记录亲密时刻并计算受孕概率',
      addRecord: '添加记录',
      date: '日期',
      note: '备注（可选）',
      save: '保存',
      records: '记录列表',
      probability: '受孕概率',
      noRecords: '暂无记录',
      delete: '删除',
      edit: '编辑',
      cancel: '取消',
      probabilityExplanation: '受孕概率根据您的月经周期数据计算',
      periodProbability: '经期期间：3%',
      ovulationProbability: '排卵期：38% - 71%（排卵日最高）',
      safePeriodProbability: '安全期：5% - 26%（因日期而异）',
      addNote: '添加备注',
      clearDate: '清除日期',
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日',
      setupPeriodFirst: '请先设置经期数据',
      setupPeriodFirstDesc: '要计算受孕概率，请先在经期计算器页面设置您的经期数据。',
      goToPeriodCalculator: '前往经期计算器',
      ovulationDay: '排卵日',
      ovulationPeriod: '排卵期',
      periodDays: '经期',
      safePeriod: '安全期',
      articles: {
        title: '知识库',
        items: [
          {
            id: 'maximize-conception',
            title: '如何通过性行为日历最大化受孕机会？',
            content: `
核心结论：科学安排同房时间可使受孕概率提升3-8倍

1. 排卵窗口锁定技术
- 黄金6天理论：排卵前5天至排卵日当天的受孕概率梯度分布（3%-35%）
- 精子存活优势：在排卵前1-2天同房，精子可提前在输卵管等待卵子

2. 多维度追踪策略
- 体温+黏液+LH试纸三合一验证法（准确率提升至92%）
- 智能硬件辅助：Apple Watch夜间体温监测误差仅±0.1℃

3. 同房频率优化公式

| 窗口期天数 | 建议同房次数 |
| 6天 | 4-5次 |
| 5天 | 3-4次 |
| 4天 | 3次 |

4. 特殊人群策略
- 月经不规律者：采用跨周期重叠法，取3个经期周期交集
- 高龄备孕：聚焦排卵前24小时，配合辅酶Q10补充`
          },
          {
            id: 'dual-mode-calendar',
            title: '性行为日历的双模管理：科学避孕与精准备孕',
            content: `
模式切换逻辑：

1. 避孕模式
- 动态安全期算法：结合日历法（预测误差±2天）与体温法（实际排卵后锁定）
- 风险警示机制：在预测安全期叠加25%失败率提示

2. 备孕模式
- 概率热力图：根据历史数据生成每月最佳同房日
- 精子质量优化提示：建议同房间隔48小时

3. 混合模式案例

| 阶段 | 模式 | 颜色标记 | 功能特点 |
| 前半月 | 避孕模式 | 灰色 | 安全期预测 |
| 排卵后 | 备孕模式 | 绿色 | 受孕优化 |`
          }
        ]
      }
    }
  };

  const t = translations[language];

  // 从localStorage获取经期数据
  useEffect(() => {
    const storedPeriodData = localStorage.getItem('periodData');
    if (storedPeriodData) {
      try {
        const data = JSON.parse(storedPeriodData);
        setPeriodData(data);
        setHasPeriodData(true);
        
        // 查看是否包含未来周期数据
        if (data.futureCycles && data.futureCycles.length > 0) {
          console.log(`加载了${data.futureCycles.length}个未来周期数据`);
        }
      } catch (error) {
        console.error('Error parsing period data:', error);
        setHasPeriodData(false);
      }
    } else {
      setHasPeriodData(false);
    }
  }, []);

  // 从localStorage加载记录
  useEffect(() => {
    const storedRecords = localStorage.getItem('sexRecords');
    if (storedRecords) {
      try {
        const parsedRecords = JSON.parse(storedRecords).map((record: any) => ({
          ...record,
          date: new Date(record.date)
        }));
        setRecords(parsedRecords);
      } catch (error) {
        console.error('Error parsing sex records:', error);
        setRecords([]);
      }
    }
  }, []);

  // 保存记录到localStorage
  useEffect(() => {
    if (records.length > 0) {
      const recordsToSave = records.map(record => ({
        ...record,
        date: record.date.toISOString()
      }));
      localStorage.setItem('sexRecords', JSON.stringify(recordsToSave));
    }
  }, [records]);

  // 当经期数据变化时重新计算概率
  useEffect(() => {
    if (periodData) {
      setHasPeriodData(true);
    }
  }, [periodData]);

  // 计算受孕概率
  const calculateProbability = (date: Date): number => {
    if (!periodData || !periodData.lastPeriodDate) return 0;

    // 创建日期对象并设置为当天的开始时间（0时0分0秒）
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // 如果有未来周期数据，使用它来获取更精确的概率
    if (periodData.futureCycles && periodData.futureCycles.length > 0) {
      // 找到目标日期所在的周期
      for (let i = 0; i < periodData.futureCycles.length; i++) {
        const cycle = periodData.futureCycles[i];
        const periodStart = new Date(cycle.periodStart);
        let nextPeriodStart = null;
        
        // 获取下一个周期的开始日期（如果有）
        if (i < periodData.futureCycles.length - 1) {
          nextPeriodStart = new Date(periodData.futureCycles[i + 1].periodStart);
        } else {
          // 如果是最后一个周期，估算下一个周期开始日期
          nextPeriodStart = new Date(periodStart);
          nextPeriodStart.setDate(nextPeriodStart.getDate() + periodData.cycleLength);
        }
        
        // 检查目标日期是否在当前周期内
        if (targetDate >= periodStart && targetDate < nextPeriodStart) {
          // 获取排卵日
          const ovulationDate = new Date(cycle.ovulationDate);
          
          // 计算目标日期与排卵日的天数差
          const daysFromOvulation = Math.floor((targetDate.getTime() - ovulationDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // 经期期间（前5天）
          const daysSinceLastPeriod = Math.floor((targetDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < periodData.periodLength) {
            return 3;
          }

          // 排卵期概率（排卵日前5天到后4天）
          if (daysFromOvulation >= -5 && daysFromOvulation <= 4) {
            // 排卵日前5天到排卵日
            if (daysFromOvulation <= 0) {
              const probabilities = [38, 48, 62, 66, 69, 71];  // 从排卵日前5天到排卵日
              return probabilities[daysFromOvulation + 5];
            }
            // 排卵日后1-4天
            else {
              const probabilities = [57, 43, 36, 26];  // 排卵日后1-4天
              return probabilities[daysFromOvulation - 1];
            }
          }

          // 临近排卵期的安全期
          if (daysFromOvulation === -7) return 20;  // 排卵日前两天
          if (daysFromOvulation === -6) return 24;  // 排卵日前一天

          // 排卵期结束后的安全期
          if (daysFromOvulation === 5) return 21;   // 排卵期结束后第一天
          if (daysFromOvulation === 6) return 17;   // 排卵期结束后第二天
          if (daysFromOvulation === 7) return 14;   // 排卵期结束后第三天
          
          // 其余安全期
          return 5;
        }
      }
    }
    
    // 如果没有找到匹配的周期或没有未来周期数据，使用传统计算方法
    const lastPeriod = new Date(periodData.lastPeriodDate + 'T00:00:00');
    
    // 计算日期与最后一次经期开始日期的天数差
    const daysSinceLastPeriod = Math.floor((targetDate.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    // 计算在周期中的哪一天（例如，第1天、第15天等）
    const dayInCycle = (daysSinceLastPeriod % periodData.cycleLength + periodData.cycleLength) % periodData.cycleLength;
    
    // 经期期间
    if (dayInCycle < periodData.periodLength) {
      return 3;
    }
    
    // 计算排卵日（周期长度减去14天）
    const ovulationDay = periodData.cycleLength - 14;
    
    // 计算与排卵日的天数差
    const daysFromOvulation = dayInCycle - ovulationDay;
    
    // 排卵期概率（排卵日前5天到后4天）
    if (daysFromOvulation >= -5 && daysFromOvulation <= 4) {
      // 排卵日前5天到排卵日
      if (daysFromOvulation <= 0) {
        const probabilities = [38, 48, 62, 66, 69, 71];  // 从排卵日前5天到排卵日
        return probabilities[daysFromOvulation + 5];
      }
      // 排卵日后1-4天
      else {
        const probabilities = [57, 43, 36, 26];  // 排卵日后1-4天
        return probabilities[daysFromOvulation - 1];
      }
    }

    // 临近排卵期的安全期
    if (daysFromOvulation === -7) return 20;  // 排卵日前两天
    if (daysFromOvulation === -6) return 24;  // 排卵日前一天

    // 排卵期结束后的安全期
    if (daysFromOvulation === 5) return 21;   // 排卵期结束后第一天
    if (daysFromOvulation === 6) return 17;   // 排卵期结束后第二天
    if (daysFromOvulation === 7) return 14;   // 排卵期结束后第三天

    // 其余安全期
    return 5;
  };

  // 获取当前月份的天数
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // 获取当前月份第一天是星期几
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentViewMonth);
    const firstDay = getFirstDayOfMonth(currentViewMonth);
    const days = [];

    // 添加上个月的日期
    const prevMonthDays = getDaysInMonth(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }

    // 添加当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), i),
        isCurrentMonth: true
      });
    }

    // 添加下个月的日期
    const remainingDays = 42 - days.length; // 6行7列 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  // 检查日期是否有记录
  const hasRecord = (date: Date) => {
    return records.some(record => 
      record.date.getDate() === date.getDate() &&
      record.date.getMonth() === date.getMonth() &&
      record.date.getFullYear() === date.getFullYear()
    );
  };

  // 获取日期的记录
  const getRecord = (date: Date) => {
    return records.find(record => 
      record.date.getDate() === date.getDate() &&
      record.date.getMonth() === date.getMonth() &&
      record.date.getFullYear() === date.getFullYear()
    );
  };

  // 处理日期点击
  const handleDateClick = (date: Date) => {
    const record = getRecord(date);
    if (record) {
      // 如果已有记录，则删除记录
      setRecords(records.filter(r => 
        r.date.getDate() !== date.getDate() ||
        r.date.getMonth() !== date.getMonth() ||
        r.date.getFullYear() !== date.getFullYear()
      ));
    } else {
      // 如果没有记录，则添加记录
      setRecords([...records, { date, note: '' }]);
    }
  };

  // 处理添加备注
  const handleAddNote = () => {
    if (!selectedDate) return;

    const existingRecord = getRecord(selectedDate);
    if (existingRecord) {
      // 更新现有记录的备注
      setRecords(records.map(record => 
        record.date.getDate() === selectedDate.getDate() &&
        record.date.getMonth() === selectedDate.getMonth() &&
        record.date.getFullYear() === selectedDate.getFullYear()
          ? { ...record, note }
          : record
      ));
    } else {
      // 添加新记录
      setRecords([...records, { date: selectedDate, note }]);
    }

    setSelectedDate(null);
    setNote('');
  };

  // 检查日期是否在排卵期
  const isOvulationDay = (date: Date): boolean => {
    if (!periodData || !periodData.lastPeriodDate) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodDate);
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysSinceLastPeriod % periodData.cycleLength;
    
    const ovulationDay = periodData.ovulationDay || (periodData.cycleLength - 14);
    return dayInCycle === ovulationDay;
  };

  // 检查日期是否在排卵期
  const isOvulationPeriod = (date: Date): boolean => {
    if (!periodData || !periodData.lastPeriodDate) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodDate);
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysSinceLastPeriod % periodData.cycleLength;
    
    const ovulationDay = periodData.ovulationDay || (periodData.cycleLength - 14);
    const ovulationStart = periodData.ovulationStart || (ovulationDay - 5);
    const ovulationEnd = periodData.ovulationEnd || (ovulationDay + 4);
    
    return dayInCycle >= ovulationStart && dayInCycle <= ovulationEnd && dayInCycle !== ovulationDay;
  };

  // 检查日期是否在经期
  const isPeriodDay = (date: Date): boolean => {
    if (!periodData || !periodData.lastPeriodDate) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodDate);
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysSinceLastPeriod % periodData.cycleLength;
    
    return dayInCycle < periodData.periodLength;
  };

  // 检查日期是否在安全期
  const isSafePeriod = (date: Date): boolean => {
    if (!periodData || !periodData.lastPeriodDate) return false;
    
    const lastPeriod = new Date(periodData.lastPeriodDate);
    const daysSinceLastPeriod = Math.floor((date.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysSinceLastPeriod % periodData.cycleLength;
    
    const ovulationDay = periodData.ovulationDay || (periodData.cycleLength - 14);
    const ovulationStart = periodData.ovulationStart || (ovulationDay - 5);
    const ovulationEnd = periodData.ovulationEnd || (ovulationDay + 4);
    
    return (dayInCycle < ovulationStart || dayInCycle > ovulationEnd) && !isPeriodDay(date);
  };

  const calendarDays = generateCalendarDays();
  const weekDays = [t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday, t.sunday];

  // 错误模态框组件
  const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
            <button
              onClick={onClose}
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
            >
              {language === 'zh' ? '确定' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 回到今天按钮的处理函数
  const resetToCurrentMonth = () => {
    setCurrentViewMonth(new Date());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-pink-50 to-white relative">
      {errorMessage && (
        <ErrorModal 
          message={errorMessage} 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor="rgba(255, 192, 203, 0.35)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10 w-full overflow-y-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">{t.title}</h1>
        
        {!hasPeriodData ? (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.setupPeriodFirst}</h2>
            <p className="mb-6 text-gray-600">{t.setupPeriodFirstDesc}</p>
            <Link href="/" className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors text-lg font-medium shadow-md">
              {t.goToPeriodCalculator}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            {/* 月份导航 */}
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={() => {
                  const newDate = new Date(currentViewMonth);
                  newDate.setMonth(newDate.getMonth() - 1);
                  // 检查年份下限
                  if (newDate.getFullYear() < 1950) {
                    setErrorMessage(language === 'zh' ? 
                      '已达到最早年份限制 (1950)' : 
                      'Reached the earliest year limit (1950)');
                    return;
                  }
                  setCurrentViewMonth(newDate);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 rounded-full transition-colors text-gray-600 hover:text-pink-500"
              >
                ←
              </button>
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentViewMonth.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </h2>
                {/* 添加回到今天按钮 */}
                <button 
                  onClick={resetToCurrentMonth}
                  className="ml-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {language === 'zh' ? '返回今天' : 'Back to Today'}
                </button>
              </div>
              <button 
                onClick={() => {
                  const newDate = new Date(currentViewMonth);
                  newDate.setMonth(newDate.getMonth() + 1);
                  // 检查年份上限
                  if (newDate.getFullYear() > 3000) {
                    setErrorMessage(language === 'zh' ? 
                      '已达到最晚年份限制 (3000)' : 
                      'Reached the latest year limit (3000)');
                    return;
                  }
                  setCurrentViewMonth(newDate);
                }}
                className="w-10 h-10 flex items-center justify-center hover:bg-pink-50 rounded-full transition-colors text-gray-600 hover:text-pink-500"
              >
                →
              </button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 mb-4">
              {[t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday].map((day, index) => (
                <div key={index} className="text-center py-2 text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* 日历格子 */}
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((day, index) => {
                const isSelected = hasRecord(day.date);
                const probability = calculateProbability(day.date);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`
                      relative aspect-square p-2 cursor-pointer rounded-xl
                      flex flex-col items-center justify-center gap-1
                      ${day.isCurrentMonth ? 'hover:bg-pink-50' : 'text-gray-400 hover:bg-gray-50'}
                      ${isSelected ? 'bg-pink-100 shadow-sm' : ''}
                      transition-all duration-200
                    `}
                  >
                    <span className={`text-sm font-medium ${isSelected ? 'text-pink-700' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    
                    {/* 爱心标记 */}
                    {isSelected && (
                      <div className="relative w-6 h-6">
                        <div className="absolute inset-0 bg-pink-200 rounded-full transform rotate-45"></div>
                        <div className="absolute inset-0 bg-white rounded-full transform -rotate-45 scale-75"></div>
                      </div>
                    )}
                    
                    {/* 受孕概率 */}
                    {isSelected && probability > 0 && (
                      <div className="text-xs text-pink-600 font-medium mt-1">
                        {language === 'zh' ? `受孕率: ${probability}%` : `Fertility: ${probability}%`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 知识库 */}
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{t.articles.title}</h2>
            <div className="space-y-4">
              {t.articles.items.map((article, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => setExpandedArticles(prev => ({
                      ...prev,
                      [article.id]: !prev[article.id]
                    }))}
                    className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                    <span className="text-gray-500">
                      {expandedArticles[article.id] ? '↑' : '↓'}
                    </span>
                  </button>
                  {expandedArticles[article.id] && (
                    <div className="px-6 py-4">
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {article.content.split('\n\n').map((section, i) => {
                          if (section.startsWith('|')) {
                            const rows = section.split('\n').filter(row => row.trim() !== '');
                            return (
                              <div key={i} className="my-4 overflow-x-auto">
                                <table className="min-w-full border border-gray-200 rounded-lg">
                                  <tbody>
                                    {rows.map((row, rowIndex) => {
                                      const cells = row.split('|').filter(cell => cell.trim() !== '');
                                      if (rowIndex === 0) {
                                        return (
                                          <tr key={rowIndex} className="bg-pink-50">
                                            {cells.map((cell, cellIndex) => (
                                              <th key={cellIndex} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                                                {cell.trim()}
                                              </th>
                                            ))}
                                          </tr>
                                        );
                                      } else {
                                        return (
                                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            {cells.map((cell, cellIndex) => (
                                              <td key={cellIndex} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                                                {cell.trim()}
                                              </td>
                                            ))}
                                          </tr>
                                        );
                                      }
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          } else if (section.startsWith('-')) {
                            const items = section.split('\n').filter(item => item.trim());
                            return (
                              <ul key={i} className="list-none space-y-2 my-4">
                                {items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-gray-400">•</span>
                                    <span>{item.replace(/^-\s+/, '').trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          } else {
                            return <p key={i} className="my-3 text-sm text-gray-600 leading-relaxed">{section}</p>;
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 