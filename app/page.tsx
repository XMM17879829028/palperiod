"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, useCalendar } from './context/LanguageContext';
import { Waves } from '../components/ui/waves-background';

interface ContentBlock {
  subtitle?: string;
  items: string[];
}

interface Section {
  title: string;
  content: ContentBlock[];
}

interface Translations {
  title: string;
  subtitle: string;
  sections: {
    ovulationTracking: Section;
    menstrualHealth: Section;
    cycleBasics: Section;
  };
  tip: string;
  safePeriod: string;
  today: string;
  period: string;
  ovulationDay: string;
  ovulationPeriod: string;
  nextPeriod: string;
  nextOvulation: string;
  ovulationRange: string;
  cycleSettings: string;
  lastPeriodDate: string;
  averageCycleLength: string;
  averagePeriodLength: string;
  days: string;
  showOvulation: string;
  hideOvulation: string;
}

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { currentViewMonth, setCurrentViewMonth } = useCalendar();
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [calendarDays, setCalendarDays] = useState<(Date | null)[]>([]);
  const [periodDays, setPeriodDays] = useState<number[]>([]);
  const [ovulationDays, setOvulationDays] = useState<number[]>([]);
  const [nextPeriodStart, setNextPeriodStart] = useState<Date | null>(null);
  const [nextOvulationDay, setNextOvulationDay] = useState<Date | null>(null);
  const [showOvulation, setShowOvulation] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ovulationDaysList, setOvulationDaysList] = useState<number[]>([]);

  // 从localStorage加载数据
  useEffect(() => {
    const storedPeriodData = localStorage.getItem('periodData');
    if (storedPeriodData) {
      try {
        const data = JSON.parse(storedPeriodData);
        
        // 验证日期是否在有效范围内
        if (data.lastPeriodDate) {
          const date = new Date(data.lastPeriodDate);
          const year = date.getFullYear();
          
          if (year < 1950 || year > 3000) {
            // 如果日期无效，清除localStorage数据并返回
            localStorage.removeItem('periodData');
            return;
          }
        }
        
        setLastPeriodDate(data.lastPeriodDate);
        setCycleLength(data.cycleLength);
        setPeriodLength(data.periodLength);
        
        // 重新计算日期
        const nextPeriodDate = new Date(data.lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + data.cycleLength);

        const ovulationDate = new Date(nextPeriodDate);
        ovulationDate.setDate(ovulationDate.getDate() - 14);

        setNextPeriodStart(nextPeriodDate);
        setNextOvulationDay(ovulationDate);
      } catch (error) {
        console.error('Error loading period data:', error);
        // 出错时清除localStorage数据
        localStorage.removeItem('periodData');
      }
    }
  }, []);

  // 当数据变化时自动保存到localStorage
  useEffect(() => {
    if (lastPeriodDate && cycleLength && periodLength) {
      const periodData = {
        lastPeriodDate,
        cycleLength,
        periodLength
      };
      localStorage.setItem('periodData', JSON.stringify(periodData));
    }
  }, [lastPeriodDate, cycleLength, periodLength]);

  const translations: { en: Translations; zh: Translations } = {
    en: {
      title: 'Period Calculator',
      subtitle: 'Track your menstrual cycle and understand your body better',
      today: 'Back to Today',
      period: 'Period',
      ovulationDay: 'Ovulation Day',
      ovulationPeriod: 'Fertile Window',
      safePeriod: 'Safe Period',
      nextPeriod: 'Next Period Expected:',
      nextOvulation: 'Next Ovulation Day Expected:',
      ovulationRange: 'Fertile Window: 5 days before to 4 days after ovulation (10 days)',
      cycleSettings: 'Cycle Settings',
      lastPeriodDate: 'Last Period Start Date',
      averageCycleLength: 'Average Cycle Length',
      averagePeriodLength: 'Average Period Length',
      days: 'days',
      showOvulation: 'Show Fertile Window',
      hideOvulation: 'Hide Fertile Window',
      sections: {
        ovulationTracking: {
          title: 'Ovulation Tracking & Fertility Management',
          content: [
            {
              subtitle: 'For Women Trying to Conceive: Precision Timing',
              items: [
                'Basal Body Temperature (BBT): First thing every morning, measure temperature under your tongue! After ovulation, BBT rises by 0.3-0.5°C for about 14 days. Note: By the time you detect the rise, you may have missed the optimal window - plan ahead!',
                'Cervical Mucus Monitoring: Near ovulation, secretions become clear and stretchy like egg white, creating a "life channel" for sperm! Ovulation typically occurs within 48 hours after peak mucus quality.',
                'LH Test Strips: A surge in luteinizing hormone (LH) in urine indicates ovulation within 24-48 hours. When you see a strong positive, it\'s time for focused conception efforts!',
                'Ultrasound Monitoring: The most precise "follicle tracking" method. Doctors use ultrasound to monitor follicle size (mature at 18-24mm), ideal for women with irregular cycles or fertility challenges.'
              ]
            },
            {
              subtitle: 'Important Note for Contraception:',
              items: [
                'The "safe period" is NOT absolutely safe! Sperm can survive up to 3 days, and ovulation timing can shift due to stress or irregular sleep. For contraception, we recommend more reliable methods like condoms or birth control pills.'
              ]
            }
          ]
        },
        menstrualHealth: {
          title: 'Menstrual Health: Gentle Care During Your Period',
          content: [
            {
              items: [
                'Avoid Intercourse During Menstruation: The cervix is open during endometrial shedding, increasing risk of infections (e.g., pelvic inflammatory disease or endometriosis). Better to wait a few days.',
                'Monitor Warning Signs:',
                'Abnormal Bleeding: Non-menstrual bleeding or sudden heavy flow may indicate fibroids or polyps.',
                'Severe Pain: If pain persists despite medication, it could signal endometriosis. Don\'t let "period pain" mask serious health issues - seek medical attention.'
              ]
            }
          ]
        },
        cycleBasics: {
          title: 'Why Your Menstrual Cycle Matters: Beyond Periods',
          content: [
            {
              items: [
                'Your menstrual cycle is not just a fertility barometer - it\'s a vital sign of overall health.',
                'This cyclic change (averaging 28 days) is precisely regulated by the hypothalamic-pituitary-ovarian axis, orchestrating hormonal fluctuations (estrogen, progesterone, FSH, LH) for two core functions:',
                'Reproductive Preparation: Monthly ovulation and endometrial renewal create optimal conditions for potential implantation.',
                'Health Monitoring: Cycle regularity and symptom changes can warn of endocrine disorders (like PCOS), metabolic issues (like thyroid disease), or chronic inflammation.'
              ]
            },
            {
              subtitle: 'Key Reasons to Track Your Cycle',
              items: [
                'Fertility Foundation: The 5-day window around ovulation is prime for conception, but remember sperm survival time in planning.',
                'Health Decoder: Irregular cycles often signal stress (cortisol disrupting ovulation) or nutritional deficiencies (iron/vitamin D affecting follicle development).',
                'Self-Care Guide: Estrogen peaks boost energy in the follicular phase, while the luteal phase suits gentler activities.',
                'Life Stage Markers: Unusual timing of menarche or menopause may reflect genetic or environmental risks.'
              ]
            }
          ]
        }
      },
      tip: 'Stay positive for conception, choose reliable contraception, and honor your body during menstruation—you\'re the CEO of your health!'
    },
    zh: {
      title: '经期日历计算器',
      subtitle: '追踪您的月经周期，更好地了解您的身体',
      today: '返回今天',
      period: '经期',
      ovulationDay: '排卵日',
      ovulationPeriod: '排卵期',
      safePeriod: '安全期',
      nextPeriod: '预计下次月经:',
      nextOvulation: '预计下次排卵日:',
      ovulationRange: '排卵期范围：排卵日前5天至后4天（共10天）',
      cycleSettings: '月经周期设置',
      lastPeriodDate: '上次经期开始日期',
      averageCycleLength: '平均周期长度',
      averagePeriodLength: '平均经期长度',
      days: '天',
      showOvulation: '显示排卵期',
      hideOvulation: '隐藏排卵期',
      sections: {
        ovulationTracking: {
          title: '排卵期计算与生育管理',
          content: [
            {
              subtitle: '备孕女性：精准捕捉"黄金受孕时刻"',
              items: [
                '基础体温法：每天清晨睁眼第一件事——测舌下体温！排卵后体温会上升0.3-0.5℃，持续约14天。但注意，测到升温时可能已错过最佳时机，需提前行动哦～',
                '宫颈黏液观察：接近排卵时，分泌物变透明、拉丝如蛋清，像"生命通道"为精子开路！黏液高峰后48小时内是排卵日。',
                'LH试纸：尿液中黄体生成素（LH）激增预示排卵在24-48小时内到来，强阳出现时快拉上队友"加班"吧！',
                'B超监测：最精准的"卵泡直播"，医生用超声波追踪卵泡大小（18-24mm时成熟），适合月经不规律或备孕困难的姐妹。'
              ]
            },
            {
              subtitle: '避孕者警惕：安全期≠绝对安全！',
              items: [
                '精子存活长达3天，排卵可能因压力、熬夜提前或延后，安全期误差风险高！想避孕？更推荐避孕套或短效药，别赌运气。'
              ]
            }
          ]
        },
        menstrualHealth: {
          title: '经期健康：特殊时期的温柔呵护',
          content: [
            {
              items: [
                '避免经期同房：子宫内膜脱落时宫颈口开放，细菌易入侵引发盆腔炎或子宫内膜异位，忍几天更安心。',
                '关注异常信号：',
                '异常出血：非经期出血或经量骤增需警惕肌瘤、息肉等问题。',
                '疼痛加剧：痛到吃药无效？可能是子宫内膜异位症在作祟！及时就医，别让"姨妈痛"掵盖健康危机。'
              ]
            }
          ]
        },
        cycleBasics: {
          title: '月经周期的核心功能',
          content: [
            {
              items: [
                '月经周期不仅是生育能力的"晴雨表"，更是全身健康的"信号灯"。',
                '这一周期性变化（平均28天）由下丘脑-垂体-卵巢轴精密调控，通过激素波动（如雌激素、孕酮、FSH、LH）实现两大核心功能：',
                '生殖准备：每月排卵并重建子宫内膜，为受精卵着床提供条件。',
                '健康监测：周期规律性、症状变化可预警内分泌失调（如多囊卵巢综合征）、代谢异常（如甲状腺疾病）甚至慢性炎症。'
              ]
            },
            {
              subtitle: '为何重视月经周期？',
              items: [
                '生殖健康的基石：排卵日前后5天为最佳受孕期，但精子存活长达3天，需提前规划。',
                '全身健康的"解码器"：周期紊乱常提示压力（皮质醇升高抑制排卵）、营养缺乏（如铁/维生素D不足影响卵泡发育）。',
                '自我护理的科学依据：卵泡期雌激素上升提升活力，黄体期更适合舒缓运动。',
                '生命阶段的"里程碑"：初潮和绝经时间异常可能反映遗传或环境风险。'
              ]
            }
          ]
        }
      },
      tip: '小贴士：备孕保持好心情，避孕选择科学方法，经期聆听身体声音，做自己健康的第一责任人！'
    }
  };

  const monthNames = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    zh: [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ]
  };

  const weekDays = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    zh: ['一', '二', '三', '四', '五', '六', '日']
  };

  const t = translations[language];
  const months = monthNames[language];
  const days = weekDays[language];

  useEffect(() => {
    generateCalendar();
  }, [currentViewMonth, lastPeriodDate, cycleLength, periodLength, showOvulation]);

  const generateCalendar = () => {
    const days = [];
    const firstDay = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), 1);
    const lastDay = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, 0);
    
    // 获取当月第一天是星期几 (0-6)
    let dayOfWeek = firstDay.getDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 调整为周一为0
    
    // 填充月初的空白
    for (let i = 0; i < dayOfWeek; i++) {
      days.push(null);
    }
    
    // 填充月份日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), i));
    }
    
    setCalendarDays(days);
    
    // 计算经期和排卵期日期
    if (lastPeriodDate) {
      const periodDates = []; // 当前月份的经期日期
      const ovulationDates = []; // 当前月份的排卵期日期
      const ovulationDayDates = []; // 当前月份的排卵日日期
      
      const lastPeriod = new Date(lastPeriodDate);
      
      // 计算所有周期数据
      const allCycles = [];
      let cycleStart = new Date(lastPeriod);
      
      // 计算过去和未来的多个周期，确保覆盖当前显示的月份
      for (let i = 0; i < 24; i++) { // 增加到24个周期以确保覆盖更多月份
        // 创建并设置当前周期的开始日期（确保使用整数日期）
        const periodStartDate = new Date(
          cycleStart.getFullYear(),
          cycleStart.getMonth(),
          cycleStart.getDate()
        );
        
        // 计算当前周期的结束日期（开始日期 + 经期长度 - 1）
        // 减1是因为经期长度包括开始日期
        const periodEndDate = new Date(
          periodStartDate.getFullYear(),
          periodStartDate.getMonth(),
          periodStartDate.getDate() + (periodLength - 1)
        );
        
        // 计算下一个周期的开始日期（当前周期开始 + 整个周期长度）
        const nextPeriodStartDate = new Date(
          periodStartDate.getFullYear(),
          periodStartDate.getMonth(),
          periodStartDate.getDate() + cycleLength
        );
        
        // 计算当前周期的排卵日（下一个经期前14天）
        const ovulationDate = new Date(
          nextPeriodStartDate.getFullYear(),
          nextPeriodStartDate.getMonth(),
          nextPeriodStartDate.getDate() - 14
        );
        
        // 计算排卵期开始（排卵日前5天）
        const ovulationStartDate = new Date(
          ovulationDate.getFullYear(),
          ovulationDate.getMonth(),
          ovulationDate.getDate() - 5
        );
        
        // 计算排卵期结束（排卵日后4天）
        const ovulationEndDate = new Date(
          ovulationDate.getFullYear(),
          ovulationDate.getMonth(),
          ovulationDate.getDate() + 4
        );
        
        // 保存周期数据
        allCycles.push({
          periodStart: periodStartDate,
          periodEnd: periodEndDate,
          ovulationDate: ovulationDate,
          ovulationStart: ovulationStartDate,
          ovulationEnd: ovulationEndDate,
          nextPeriodStart: nextPeriodStartDate
        });
        
        // 设置下一个周期的开始日期
        cycleStart = new Date(
          nextPeriodStartDate.getFullYear(),
          nextPeriodStartDate.getMonth(),
          nextPeriodStartDate.getDate()
        );
      }
      
      // 当前日期
      const today = new Date();
      
      // 找到下一个将来的周期（用于显示预测信息）
      let nextFuturePeriodStart = null;
      let nextFutureOvulationDay = null;
      
      // 遍历所有周期，找出当前日期之后的第一个排卵日和经期开始日
      for (const cycle of allCycles) {
        // 检查排卵日是否在今天之后且尚未找到下一个排卵日
        if (cycle.ovulationDate > today && !nextFutureOvulationDay) {
          nextFutureOvulationDay = cycle.ovulationDate;
        }
        
        // 检查经期开始日是否在今天之后且尚未找到下一个经期开始日
        if (cycle.periodStart > today && !nextFuturePeriodStart) {
          nextFuturePeriodStart = cycle.periodStart;
        }
        
        // 如果已经找到了下一个排卵日和下一个经期开始日，可以提前结束循环
        if (nextFutureOvulationDay && nextFuturePeriodStart) {
          break;
        }
      }
      
      // 设置状态
      if (nextFuturePeriodStart) {
        // 确保设置一个新的日期对象实例
        setNextPeriodStart(new Date(nextFuturePeriodStart.getTime()));
      }
      if (nextFutureOvulationDay) {
        // 确保设置一个新的日期对象实例
        setNextOvulationDay(new Date(nextFutureOvulationDay.getTime()));
      }
      
      // 检查当前月份的每一天是否在周期范围内
      // 获取当前月份的年和月
      const currentYear = currentViewMonth.getFullYear();
      const currentMonth = currentViewMonth.getMonth();
      
      // 计算当前月的时间范围
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      // 将当前月份的每一天与所有周期数据进行比较
      // 先计算当前月份内所有日期
      const datesInMonth = [];
      for (let d = 1; d <= monthEnd.getDate(); d++) {
        datesInMonth.push(new Date(currentYear, currentMonth, d));
      }
      
      // 对每个日期进行判断
      datesInMonth.forEach(date => {
        const day = date.getDate();
        
        // 检查该日期是否在任何周期的经期内
        const inPeriod = allCycles.some(cycle => {
          // 比较年月日
          // 创建仅包含年月日的日期对象进行比较
          const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const cycleStartDate = new Date(cycle.periodStart.getFullYear(), cycle.periodStart.getMonth(), cycle.periodStart.getDate());
          const cycleEndDate = new Date(cycle.periodEnd.getFullYear(), cycle.periodEnd.getMonth(), cycle.periodEnd.getDate());
          
          // 检查日期是否在经期范围内 (>= 开始日期 且 <= 结束日期)
          return dateToCheck >= cycleStartDate && dateToCheck <= cycleEndDate;
        });
        
        if (inPeriod) {
          periodDates.push(day);
        }
        
        // 检查该日期是否在任何周期的排卵期内
        const inOvulationPeriod = allCycles.some(cycle => {
          // 比较年月日
          // 创建仅包含年月日的日期对象进行比较
          const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const ovStartDate = new Date(cycle.ovulationStart.getFullYear(), cycle.ovulationStart.getMonth(), cycle.ovulationStart.getDate());
          const ovEndDate = new Date(cycle.ovulationEnd.getFullYear(), cycle.ovulationEnd.getMonth(), cycle.ovulationEnd.getDate());
          
          // 检查日期是否在排卵期范围内
          return dateToCheck >= ovStartDate && dateToCheck <= ovEndDate;
        });
        
        if (inOvulationPeriod) {
          ovulationDates.push(day);
        }
        
        // 检查该日期是否是任何周期的排卵日
        const isOvulationDay = allCycles.some(cycle => {
          // 比较年月日
          const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const ovDayDate = new Date(cycle.ovulationDate.getFullYear(), cycle.ovulationDate.getMonth(), cycle.ovulationDate.getDate());
          
          // 检查是否是排卵日
          return dateToCheck.getTime() === ovDayDate.getTime();
        });
        
        if (isOvulationDay) {
          ovulationDayDates.push(day);
        }
      });
      
      setPeriodDays(periodDates);
      setOvulationDays(ovulationDates);
      setOvulationDaysList(ovulationDayDates);
    }
  };

  const prevMonth = () => {
    const newDate = new Date(currentViewMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    
    // 检查年份下限
    if (newDate.getFullYear() < 1950) {
      // 使用模态框替代 alert
      setErrorMessage(language === 'zh' ? 
        '已达到最早年份限制 (1950)' : 
        'Reached the earliest year limit (1950)');
      return;
    }
    
    setCurrentViewMonth(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentViewMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    
    // 检查年份上限
    if (newDate.getFullYear() > 3000) {
      // 使用模态框替代 alert
      setErrorMessage(language === 'zh' ? 
        '已达到最晚年份限制 (3000)' : 
        'Reached the latest year limit (3000)');
      return;
    }
    
    setCurrentViewMonth(newDate);
  };

  const resetToCurrentMonth = () => {
    setCurrentViewMonth(new Date());
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    // 使用标准的日期格式化
    // 确保月份和日期是两位数
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const toggleOvulation = () => {
    setShowOvulation(!showOvulation);
  };

  // 处理经期日期变化
  const handlePeriodDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 仅更新日期值，不进行验证
    setLastPeriodDate(e.target.value);
  };

  // 处理日期输入完成后的验证
  const handlePeriodDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    
    // 验证日期是否在有效范围内（1950-3000年）
    if (dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      
      if (year < 1950 || year > 3000) {
        // 使用模态框替代 alert
        setErrorMessage(language === 'zh' ? 
          '请输入1950年至3000年之间的日期' : 
          'Please enter a date between 1950 and 3000');
        // 清空无效日期
        setLastPeriodDate('');
        // 清空预测结果
        setNextPeriodStart(null);
        setNextOvulationDay(null);
        // 从localStorage移除无效数据
        localStorage.removeItem('periodData');
      }
    }
  };

  // 处理周期长度变化
  const handleCycleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCycleLength(parseInt(e.target.value));
  };

  // 处理经期长度变化
  const handlePeriodLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriodLength(parseInt(e.target.value));
  };

  // 处理计算按钮点击
  const handleCalculate = () => {
    if (!lastPeriodDate) return;

    // 验证日期是否在有效范围内（1950-3000年）
    const date = new Date(lastPeriodDate);
    const year = date.getFullYear();
    
    if (year < 1950 || year > 3000) {
      // 使用模态框替代 alert
      setErrorMessage(language === 'zh' ? 
        '请输入1950年至3000年之间的日期' : 
        'Please enter a date between 1950 and 3000');
      // 清空无效日期
      setLastPeriodDate('');
      // 清空预测结果
      setNextPeriodStart(null);
      setNextOvulationDay(null);
      // 从localStorage移除无效数据
      localStorage.removeItem('periodData');
      return;
    }

    // 计算下次经期日期
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

    // 计算排卵日（下次经期前14天）
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    // 计算排卵期（排卵日前5天到后4天）
    const ovulationStartDate = new Date(ovulationDate);
    ovulationStartDate.setDate(ovulationStartDate.getDate() - 5);

    const ovulationEndDate = new Date(ovulationDate);
    ovulationEndDate.setDate(ovulationEndDate.getDate() + 4);
    
    // 计算未来12个周期的日期
    const futureCycles = [];
    let currentPeriodStart = new Date(lastPeriodDate);
    
    for (let i = 0; i < 12; i++) {
      // 如果不是第一个周期，计算下一个周期开始日期
      if (i > 0) {
        currentPeriodStart = new Date(currentPeriodStart);
        currentPeriodStart.setDate(currentPeriodStart.getDate() + cycleLength);
      }
      
      // 当前周期的排卵日
      const cycleOvulationDate = new Date(currentPeriodStart);
      cycleOvulationDate.setDate(cycleOvulationDate.getDate() + cycleLength - 14);
      
      // 添加到未来周期数组
      futureCycles.push({
        periodStart: new Date(currentPeriodStart),
        ovulationDate: new Date(cycleOvulationDate),
        cycleNumber: i + 1
      });
    }

    // 保存经期数据到localStorage
    const periodData = {
      lastPeriodDate,
      cycleLength,
      periodLength,
      ovulationDay: ovulationDate.getDate(),
      ovulationStart: ovulationStartDate.getDate(),
      ovulationEnd: ovulationEndDate.getDate(),
      futureCycles: futureCycles.map(cycle => ({
        periodStart: formatDate(cycle.periodStart),
        ovulationDate: formatDate(cycle.ovulationDate),
        cycleNumber: cycle.cycleNumber
      }))
    };
    localStorage.setItem('periodData', JSON.stringify(periodData));

    setNextPeriodStart(nextPeriodDate);
    setNextOvulationDay(ovulationDate);
    setShowOvulation(true);
  };

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

  return (
    <div className="flex flex-col min-h-screen relative touch-auto bg-transparent overflow-hidden">
      {/* 添加错误模态框 */}
      {errorMessage && (
        <ErrorModal 
          message={errorMessage} 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      <div className="absolute inset-0 z-0 top-[-100px]">
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
      <div className="container mx-auto px-4 py-8 relative z-10 w-full overflow-y-auto touch-auto">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-8">
            <div className="flex justify-end mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    language === 'en' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    language === 'zh' 
                      ? 'bg-pink-100 text-pink-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  中文
                </button>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-pink-600">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* 周期设置 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-pink-600">{t.cycleSettings}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.lastPeriodDate}
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={lastPeriodDate}
                  onChange={handlePeriodDateChange}
                  onBlur={handlePeriodDateBlur}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.averageCycleLength}
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="21" 
                      max="35" 
                      className="input-field w-20"
                      value={cycleLength}
                      onChange={handleCycleLengthChange}
                    />
                    <span className="ml-2">{t.days}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.averagePeriodLength}
                  </label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="2" 
                      max="10" 
                      className="input-field w-20"
                      value={periodLength}
                      onChange={handlePeriodLengthChange}
                    />
                    <span className="ml-2">{t.days}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextPeriodStart && (
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="font-medium">{t.nextPeriod}</p>
                  <p className="text-pink-700 text-lg">{formatDate(nextPeriodStart)}</p>
                </div>
              )}
              
              {showOvulation && nextOvulationDay && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium">{t.nextOvulation}</p>
                  <p className="text-purple-700 text-lg">{formatDate(nextOvulationDay)}</p>
                  <p className="text-purple-600 text-xs mt-2">{t.ovulationRange}</p>
                </div>
              )}
            </div>
          </div>

          {/* 日历组件 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="text-pink-600 hover:text-pink-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold">
                  {months[currentViewMonth.getMonth()]} {currentViewMonth.getFullYear()}
                </h2>
                <button 
                  onClick={resetToCurrentMonth} 
                  className="ml-2 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t.today}
                </button>
              </div>
              <button onClick={nextMonth} className="text-pink-600 hover:text-pink-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map(day => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, index) => {
                // 确定日期的样式类
                let bgClass = '';
                let textClass = '';
                let borderClass = '';
                
                if (!day) {
                  textClass = 'text-gray-300';
                } else {
                  // 检查是否是今天
                  const isToday = day.getDate() === new Date().getDate() && 
                                  day.getMonth() === new Date().getMonth() && 
                                  day.getFullYear() === new Date().getFullYear();
                  
                  // 检查是否是经期
                  const isPeriod = periodDays.includes(day.getDate());
                  
                  // 检查是否是排卵日 - 修改为使用ovulationDaysList
                  const isOvulationDay = showOvulation && ovulationDaysList.includes(day.getDate());
                  
                  // 检查是否是排卵期（并且显示排卵期）
                  const isOvulation = showOvulation && ovulationDays.includes(day.getDate());
                  
                  // 检查是否是安全期（非经期、非排卵日、非排卵期的日子）
                  const isSafeDay = !isPeriod && !isOvulationDay && !isOvulation;
                  
                  if (isPeriod) {
                    bgClass = 'bg-pink-100';
                    textClass = 'text-pink-800';
                  } else if (isOvulationDay) {
                    bgClass = 'bg-purple-300';
                    textClass = 'text-purple-900 font-bold';
                    borderClass = 'border-2 border-purple-500';
                  } else if (isOvulation) {
                    bgClass = 'bg-purple-100';
                    textClass = 'text-purple-800';
                  } else if (isSafeDay) {
                    textClass = 'text-green-500';
                  }
                  
                  if (isToday) {
                    bgClass = 'bg-blue-100';
                    textClass = 'text-blue-800';
                  }
                }
                
                return (
                  <div 
                    key={index} 
                    className={`h-8 sm:h-12 text-center py-1 sm:py-2 rounded-full ${bgClass} ${textClass} ${borderClass} text-sm sm:text-base`}
                  >
                    {day ? day.getDate() : ''}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 sm:w-4 sm:h-4 inline-block bg-pink-100 rounded-full mr-1 sm:mr-2"></span>
                <span>{t.period}</span>
              </div>
              {showOvulation && (
                <>
                  <div className="flex items-center">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 inline-block bg-purple-300 border-2 border-purple-500 rounded-full mr-1 sm:mr-2"></span>
                    <span>{t.ovulationDay}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 inline-block bg-purple-100 rounded-full mr-1 sm:mr-2"></span>
                    <span>{t.ovulationPeriod}</span>
                  </div>
                </>
              )}
              <div className="flex items-center">
                <span className="text-green-500">●</span>
                <span className="ml-1 sm:ml-2">{language === 'zh' ? '安全期' : 'Safe Period'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 sm:w-4 sm:h-4 inline-block bg-blue-100 rounded-full mr-1 sm:mr-2"></span>
                <span>{t.today}</span>
              </div>
              <div className="flex-grow"></div>
              <button
                onClick={toggleOvulation}
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm ${
                  showOvulation 
                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {showOvulation ? t.hideOvulation : t.showOvulation}
              </button>
            </div>
          </div>

          {/* 健康信息板块 */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {Object.entries(t.sections).map(([key, section]) => (
              <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <h2 className="text-xl font-semibold text-pink-600">{section.title}</h2>
                  <svg
                    className={`w-6 h-6 transform transition-transform ${
                      expandedSection === key ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {expandedSection === key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-6">
                        {section.content.map((block, blockIndex) => (
                          <div key={blockIndex} className="mb-4">
                            {block.subtitle && (
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{block.subtitle}</h3>
                            )}
                            <ul className="space-y-2">
                              {block.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-gray-600">{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* 底部提示 */}
          <div className="text-center text-gray-600 italic mb-8">
            {t.tip}
          </div>
        </div>
      </div>
    </div>
  );
}