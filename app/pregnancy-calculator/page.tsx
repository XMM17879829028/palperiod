"use client";

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useLanguage, useCalendar } from '../context/LanguageContext';
import Navbar from '../../components/Navbar';
import { Waves } from '../../components/ui/waves-background';
import { ErrorModal } from '@/components/ui/ErrorModal';

interface PregnancyMilestone {
  week: number;
  date: string;
  description: string;
  type: 'checkup' | 'development' | 'health' | 'warning' | 'twin';
  title: string;
  priority?: number; // 用于在同一天有多个事件时的显示优先级
}

interface Translations {
  title: string;
  subtitle: string;
  lastPeriod: string;
  calculate: string;
  weeks: string;
  days: string;
  trimester: string;
  dueDate: string;
  stage: string;
  currentStage: string;
  nextCheckup: string;
  milestones: {
    title: string;
    development: string;
    checkup: string;
    health: string;
    warning: string;
    twin: string;
  };
  stages: {
    early: string;
    middle: string;
    late: string;
  };
  checkups: {
    title: string;
    items: Array<{
      week: number;
      title: string;
      description: string;
    }>;
  };
  development: {
    items: Array<{
      week: number;
      title: string;
      description: string;
    }>;
  };
  health: {
    items: Array<{
      week: number;
      title: string;
      description: string;
    }>;
  };
  warnings: {
    items: Array<{
      week: number;
      title: string;
      description: string;
    }>;
  };
  articles: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  eventType?: 'development' | 'checkup' | 'health' | 'warning' | 'twin';
  eventTitle?: string;
  isToday: boolean;
}

interface EventPopup {
  date: string;
  events: PregnancyMilestone[];
  position: {
    x: number;
    y: number;
  };
}

interface ArticleState {
  [key: string]: boolean;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PregnancyCalendar() {
  const { language, setLanguage } = useLanguage();
  const { currentViewMonth, setCurrentViewMonth } = useCalendar();
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [pregnancyInfo, setPregnancyInfo] = useState<{
    weeks: number;
    days: number;
    stage: string;
    dueDate: string;
    milestones: PregnancyMilestone[];
    nextCheckup: PregnancyMilestone | null;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventPopup | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 从localStorage加载数据
  useEffect(() => {
    const storedPregnancyData = localStorage.getItem('pregnancyData');
    if (storedPregnancyData) {
      try {
        const data = JSON.parse(storedPregnancyData);
        
        // 添加日期验证逻辑
        if (data.lastPeriodDate) {
          const dateYear = new Date(data.lastPeriodDate).getFullYear();
          if (dateYear >= 1950 && dateYear <= 3000) {
            setLastPeriodDate(data.lastPeriodDate);
            if (data.pregnancyInfo) {
              setPregnancyInfo({
                ...data.pregnancyInfo,
                milestones: data.pregnancyInfo.milestones.map((milestone: any) => ({
                  ...milestone,
                  date: new Date(milestone.date)
                }))
              });
            }
          } else {
            // 清除无效数据
            localStorage.removeItem('pregnancyData');
            setLastPeriodDate('');
            setPregnancyInfo(null);
          }
        }
        setExpandedArticles(data.expandedArticles || {});
      } catch (error) {
        console.error('Error loading pregnancy data:', error);
        localStorage.removeItem('pregnancyData');
      }
    }

    // 从Period Calculator加载经期数据
    const storedPeriodData = localStorage.getItem('periodData');
    if (storedPeriodData && !storedPregnancyData) {
      try {
        const data = JSON.parse(storedPeriodData);
        
        // 添加日期验证逻辑
        if (data.lastPeriodDate) {
          const dateYear = new Date(data.lastPeriodDate).getFullYear();
          if (dateYear >= 1950 && dateYear <= 3000) {
            setLastPeriodDate(data.lastPeriodDate);
            
            // 如果存在未来周期数据，可以在这里使用
            if (data.futureCycles && data.futureCycles.length > 0) {
              console.log('Found future cycles data:', data.futureCycles.length);
              // 未来可以基于这些数据增强妊娠计算器的功能
            }
          }
        }
      } catch (error) {
        console.error('Error loading period data:', error);
      }
    }
  }, []);

  // 新增：当 lastPeriodDate 变化时自动计算
  useEffect(() => {
    if (lastPeriodDate) {
      calculatePregnancy();
    }
  }, [lastPeriodDate]);

  // 保存数据到localStorage
  useEffect(() => {
    if (lastPeriodDate || pregnancyInfo) {
      const dataToSave = {
        lastPeriodDate,
        pregnancyInfo,
        expandedArticles
      };
      localStorage.setItem('pregnancyData', JSON.stringify(dataToSave));
    }
  }, [lastPeriodDate, pregnancyInfo, expandedArticles]);

  const formatWeeks = (weeks: number, days: number) => {
    if (language === 'zh') {
      return `已怀孕 ${weeks}周${days}天`;
    }
    return `Pregnancy: ${weeks}w ${days}d`;
  };

  const translations = {
    en: {
      title: 'Pregnancy Calendar',
      subtitle: 'Track your pregnancy progress week by week',
      lastPeriod: 'The First Day of Your Last Period (LMP)',
      calculate: 'Calculate Due Date',
      weeks: 'Weeks',
      days: 'Days',
      trimester: 'Stage',
      dueDate: 'Estimated Due Date (EDD)',
      stage: 'Current Stage',
      currentStage: 'Current Stage',
      nextCheckup: 'Next Checkup',
      stages: {
        early: 'First Trimester (1-12 weeks)',
        middle: 'Second Trimester (13-26 weeks)',
        late: 'Third Trimester (27-40 weeks)'
      },
      milestones: {
        title: 'Pregnancy Timeline',
        development: 'Fetal Development',
        checkup: 'Medical Checkup',
        health: 'Maternal Health',
        warning: 'Important Warning',
        twin: 'Twin Pregnancy'
      },
      checkups: {
        title: 'Important Checkups',
        items: [
          { week: 4, title: 'Pregnancy Test', description: 'Use morning urine for accurate results. If positive, schedule first prenatal visit. Avoid intense exercise and high temperatures (e.g., sauna).' },
          { week: 6, title: 'Early Ultrasound', description: 'Full bladder required. Check for intrauterine pregnancy and heartbeat. If no heartbeat detected, recheck in 1 week.' },
          { week: 7, title: 'Initial Registration', description: 'Basic examinations including blood tests, blood type, HIV/syphilis screening. Fasting required, bring ID and insurance card.' },
          { week: 11, title: 'NT Screening', description: 'Nuchal translucency scan combined with blood test to assess Down syndrome risk. Best timing 11-13 weeks, appointment required.' },
          { week: 16, title: 'Mid-term Screening', description: 'NIPT recommended for mothers ≥35 years. Amniocentesis if high risk.' },
          { week: 20, title: 'Anomaly Scan', description: 'Detailed ultrasound to check fetal structures (heart, brain). Schedule 4D ultrasound in advance.' },
          { week: 24, title: 'Glucose Test (OGTT)', description: '8-hour fasting required, blood tests at 1/2/3 hours after glucose drink. Diet control if abnormal.' },
          { week: 28, title: 'RhoGAM Shot', description: 'For Rh-negative blood type mothers. One shot at 28 weeks, another within 72 hours after delivery.' },
          { week: 30, title: 'Growth Scan', description: 'Check fetal growth, amniotic fluid, and fetal position. Try knee-chest position if breech.' },
          { week: 34, title: 'Weekly NST', description: 'Weekly fetal heart monitoring. Hospital observation if abnormal.' },
          { week: 36, title: 'Term Assessment', description: 'Prepare hospital bag with documents, baby clothes, maternity pads. Plan transportation route.' }
        ]
      },
      development: {
        items: [
          { week: 4, title: 'Implantation', description: 'Fertilized egg implants in uterus. First positive pregnancy test possible.' },
          { week: 6, title: 'Heartbeat', description: 'Fetal heartbeat detectable via ultrasound.' },
          { week: 12, title: 'First Trimester Complete', description: 'Major organs formed, miscarriage risk decreases significantly.' },
          { week: 20, title: 'Gender Visible', description: 'Baby\'s sex can be determined via ultrasound. Active movements felt.' },
          { week: 24, title: 'Viability', description: 'Baby has chance of survival if born prematurely.' },
          { week: 28, title: 'Third Trimester Begins', description: 'Rapid brain and body growth period.' },
          { week: 37, title: 'Full Term', description: 'Baby is fully developed and can be born safely.' }
        ]
      },
      health: {
        items: [
          { week: 1, title: 'Start Folic Acid', description: 'Take 0.4mg folic acid daily. Avoid raw food, alcohol, caffeine >200mg/day (about 2 cups of coffee).' },
          { week: 22, title: 'Fetal Movement Count', description: 'Count 3 times daily (after meals), ≥3 movements per hour is normal. Record any unusual decrease.' },
          { week: 24, title: 'Sleep Position Guide', description: 'Prefer left side position to improve uterine rotation and reduce leg swelling. Use pregnancy pillow for support.' },
          { week: 28, title: 'Weight Control', description: 'Weekly weight gain ≤0.5kg. Limit salt, elevate legs. Emergency if BP ≥140/90mmHg with headache.' },
          { week: 37, title: 'Labor Signs', description: 'Watch for regular contractions (≤5 min apart), water breaking (lie down immediately), or bloody show (labor within 48h).' }
        ]
      },
      warnings: {
        items: [
          { week: 6, title: 'Early Warning Signs', description: 'Seek immediate medical care for bleeding/severe pain/persistent vomiting (risk of miscarriage or ectopic pregnancy).' },
          { week: 20, title: 'Preeclampsia Watch', description: 'Monitor blood pressure and swelling. Emergency if BP ≥140/90mmHg with headache.' },
          { week: 28, title: 'Reduced Movement', description: 'Contact doctor if less than 3 movements per hour during counting.' },
          { week: 37, title: 'Emergency Signs', description: 'Immediate hospital visit for regular contractions ≤5 min apart, water breaking, or heavy bleeding.' }
        ]
      },
      articles: {
        title: 'Pregnancy Knowledge Base',
        items: [
          {
            id: 'discharge-comparison',
            title: 'Discharge Before Period vs Early Pregnancy: The Ultimate Guide',
            content: `
Core Differences Comparison Table

| Feature | Pre-Period Discharge | Early Pregnancy Discharge | Medical Basis |
|---------|---------------------|--------------------------|---------------|
| Timing | 3-7 days before period | 7-14 days after conception (implantation) | |
| Color & Texture | Milky white/gray/cloudy, sticky like latex | Transparent/milky white, thin watery or egg white-like | |
| Amount | Gradually decreasing | Continuously increasing (30%-50% more than usual) | |
| Special Phenomena | May contain brown blood streaks (prelude to period) | About 25% accompanied by pink "implantation bleeding" | |
| Accompanying Symptoms | Bloating, back pain, mood swings | Morning sickness, frequent urination, persistent breast tenderness | |

Warning Signs Recognition Table

| Discharge Characteristics | Possible Issues | Response Measures |
|--------------------------|-----------------|-------------------|
| Yellow-green + fishy odor | Bacterial vaginosis | Gynecological visit within 48 hours |
| Cottage cheese-like + itching | Yeast infection | Antifungal suppositories (prescription required) |
| Persistent brown + lower abdominal cramps | Ectopic pregnancy risk | Immediate emergency ultrasound |

Self-Check Flow Chart
1. Observation Time: Record if discharge changes occur more than 3 days before expected period
2. Testing Recommendations:
   - No symptoms: Use pregnancy test (morning urine) 12 days after ovulation
   - With symptoms: Immediate test + retest after 48 hours
3. Medical Intervention Timing: When warning signs appear or test shows "one deep one light"

First Response Pregnancy Test: When & How to Get Accurate Results

Precise Testing Time Table

| Testing Scenario | Best Urine Time | Detection Sensitivity (hCG mIU/mL) |
|------------------|-----------------|-----------------------------------|
| 5 days before expected period | First morning urine | 10-25 |
| On expected period day | Any time (limit water for 2 hours) | 25-50 |
| 48 hours after suspected implantation bleeding | Afternoon urine (3-8 PM) | 50-100 |

Operation Guide
Steps:
1. Use within 1 hour after opening
2. Immerse test strip arrow for 3 seconds (not dripping method)
3. Lay flat and wait 3 minutes for reading

Common Mistakes:
- ✘ Using diluted evening urine → False negative rate ↑30%
- ✘ Reading after 5 minutes → Evaporation line misreading rate ↑45%
- ✘ Taking hCG-containing medications → False positive risk

Result Interpretation Matrix

| Display Status | Medical Interpretation | Follow-up Action |
|----------------|------------------------|------------------|
| Double line (even faint) | Pregnancy positive | Retest after 48 hours + schedule β-hCG blood test |
| Single line | No hCG detected | Retest if period delayed by 7 days |
| No line/fuzzy band | Test strip failure | Change brand and retest |

Special Scenarios
- Ectopic Pregnancy: Slow hCG rise (<50% increase every 48 hours), needs ultrasound
- Chemical Pregnancy: Test line fading + period arrival, chromosome check recommended
- PCOS: False positive rate <1%, but hormone interference needs to be ruled out
            `
          },
          {
            id: 'pregnancy-test-guide',
            title: 'The "Golden 8-Hour Rule" for Early Pregnancy Tests',
            content: `
Precise Testing Time Table

| Testing Scenario | Best Urine Time | Detection Sensitivity (hCG mIU/mL) |
|------------------|-----------------|-----------------------------------|
| 5 days before expected period | First morning urine | 10-25 |
| On expected period day | Any time (limit water for 2 hours) | 25-50 |
| 48 hours after suspected implantation bleeding | Afternoon urine (3-8 PM) | 50-100 |

Operation Guide
Steps:
1. Use within 1 hour after opening
2. Immerse test strip arrow for 3 seconds (not dripping method)
3. Lay flat and wait 3 minutes for reading

Common Mistakes:
- ✘ Using diluted evening urine → False negative rate ↑30%
- ✘ Reading after 5 minutes → Evaporation line misreading rate ↑45%
- ✘ Taking hCG-containing medications → False positive risk

Result Interpretation Matrix

| Display Status | Medical Interpretation | Follow-up Action |
|----------------|------------------------|------------------|
| Double line (even faint) | Pregnancy positive | Retest after 48 hours + schedule β-hCG blood test |
| Single line | No hCG detected | Retest if period delayed by 7 days |
| No line/fuzzy band | Test strip failure | Change brand and retest |

Special Scenarios
- Ectopic Pregnancy: Slow hCG rise (<50% increase every 48 hours), needs ultrasound
- Chemical Pregnancy: Test line fading + period arrival, chromosome check recommended
- PCOS: False positive rate <1%, but hormone interference needs to be ruled out
            `
          }
        ]
      }
    },
    zh: {
      title: '怀孕日历',
      subtitle: '按周追踪您的怀孕进展',
      lastPeriod: '最后一次月经的第一天（LMP）',
      calculate: '计算预产期',
      weeks: '周',
      days: '天',
      trimester: '阶段',
      dueDate: '预计产期（EDD）',
      stage: '当前阶段',
      currentStage: '当前阶段',
      nextCheckup: '下次产检',
      stages: {
        early: '第一孕期（1-12周）',
        middle: '第二孕期（13-26周）',
        late: '第三孕期（27-40周）'
      },
      milestones: {
        title: '孕期时间轴',
        development: '胎儿发育',
        checkup: '产检项目',
        health: '孕妇健康',
        warning: '重要警示',
        twin: '双胎专属'
      },
      checkups: {
        title: '重要产检',
        items: [
          { week: 4, title: '验孕试纸确认', description: '使用晨尿检测更准确，若阳性需预约首次产检。避免剧烈运动、高温环境（如桑拿）。' },
          { week: 6, title: '早孕B超', description: '需憋尿，确认宫内孕和胎心。若未见胎心，1周后复查。' },
          { week: 7, title: '建档基础检查', description: '包括血常规、血型、HIV/梅毒筛查。空腹抽血，携带身份证/医保卡。' },
          { week: 11, title: 'NT筛查', description: '颈项透明层厚度检查，结合血检评估唐氏综合征风险。最佳时间11-13周，需提前预约。' },
          { week: 16, title: '中期唐氏筛查', description: '高龄（≥35岁）建议直接选无创DNA。若高风险需羊水穿刺。' },
          { week: 20, title: '大排畸超声', description: '检查胎儿结构畸形（如心脏、脑部）。提前预约四维彩超。' },
          { week: 24, title: '糖耐量测试', description: '空腹8小时，服糖水后1/2/3小时各抽血一次。异常值需控糖饮食。' },
          { week: 28, title: 'RhoGAM注射', description: 'Rh阴性血型需要注射，28周和产后72小时内各1针。' },
          { week: 30, title: '胎儿生长超声', description: '评估胎儿体重、羊水量和胎位。若臀位可尝试胸膝卧位矫正。' },
          { week: 34, title: '胎心监护', description: '每周1次，监测胎儿缺氧风险。异常需住院观察。' },
          { week: 36, title: '足月评估', description: '准备待产包：证件（身份证/医保卡）、婴儿衣物、产褥垫。规划车辆路线。' }
        ]
      },
      development: {
        items: [
          { week: 4, title: '着床', description: '受精卵在子宫着床，可能出现首次阳性验孕结果。' },
          { week: 6, title: '胎心出现', description: '可通过B超检测到胎心。' },
          { week: 12, title: '第一孕期完成', description: '主要器官形成，流产风险显著降低。' },
          { week: 20, title: '性别可见', description: '可通过B超确定胎儿性别，能感受到明显胎动。' },
          { week: 24, title: '存活能力', description: '胎儿具备早产存活能力。' },
          { week: 28, title: '进入晚期', description: '开始大脑和身体快速发育期。' },
          { week: 37, title: '足月', description: '胎儿发育完善，可以安全分娩。' }
        ]
      },
      health: {
        items: [
          { week: 1, title: '开始补充叶酸', description: '每天服用0.4mg叶酸。避免生食、烟酒、咖啡因＞200mg/天（约2杯咖啡）。' },
          { week: 22, title: '胎动计数训练', description: '每天固定3次（如餐后），1小时内≥3次为正常。记录异常减少。' },
          { week: 24, title: '睡姿指导', description: '左侧卧位优先，改善子宫右旋，缓解下肢水肿。可用孕妇枕支撑。' },
          { week: 28, title: '控制体重', description: '每周增重≤0.5kg。限盐、抬高下肢。若血压≥140/90mmHg伴头痛需急诊。' },
          { week: 37, title: '临产征兆识别', description: '规律宫缩（间隔≤5分钟）、破水（立即平卧送医）、见红（48小时内分娩）。' }
        ]
      },
      warnings: {
        items: [
          { week: 6, title: '早期警示', description: '出血/剧痛/持续呕吐需立即就医（警惕流产或宫外孕）。' },
          { week: 20, title: '子痫前期监测', description: '监测血压和水肿。若血压≥140/90mmHg伴头痛需急诊。' },
          { week: 28, title: '胎动减少', description: '计数时1小时内少于3次需就医。' },
          { week: 37, title: '紧急征兆', description: '规律宫缩间隔≤5分钟、破水或大出血需立即就医。' }
        ]
      },
      articles: {
        title: '孕期知识库',
        items: [
          {
            id: 'discharge-comparison',
            title: '五张表看懂"月经前兆"和"早孕信号"分泌物差异',
            content: `
核心差异对比表  

| 特征                  | 月经前分泌物                         | 早孕分泌物                                | 医学依据                  |  
|-----------------------|------------------------------------|-----------------------------------------|-------------------------|  
| 出现时间          | 经前3-7天                          | 受孕后7-14天（着床期）                    |         |  
| 颜色质地          | 乳白/灰白/浑浊，粘稠似乳胶           | 透明/乳白，稀薄水状或蛋清状                |         |  
| 分泌量            | 逐渐减少                           | 持续增多（比平时多30%-50%）                |              |  
| 特殊现象          | 可能含褐色血丝（经血前奏）           | 约25%伴有粉红色"着床出血"                   |               |  
| 伴随症状          | 腹胀、腰酸、情绪波动                 | 晨吐、尿频、持续乳房胀痛                    |              |  


危险信号识别表  

| 分泌物特征             | 可能问题                          | 应对措施                                |  
|-----------------------|---------------------------------|---------------------------------------|  
| 黄绿色+鱼腥味          | 细菌性阴道炎                    | 48小时内妇科就诊              |  
| 豆腐渣样+瘙痒          | 念珠菌感染                      | 抗真菌栓剂（需医生处方）             |  
| 持续褐色+下腹绞痛       | 宫外孕风险                      | 立即急诊超声检查              |  


自检流程图  
1. 观察时间：记录分泌物变化是否早于预期经期3天以上  
2. 测试建议：  
   - 无症状：排卵后12天用早孕试纸（晨尿）  
   - 有症状：即时检测+48小时复测   
3. 医疗介入时机：当出现上表危险信号或试纸显示"一深一浅"   

早孕试纸的"黄金8小时"法则

精准测试时间表  

| 检测场景               | 最佳尿样时间                  | 检测灵敏度（hCG mIU/mL） |  
|-----------------------|----------------------------|-------------------------|  
| 预期经期前5天          | 晨起第一泡尿                | 10-25                   |  
| 预期经期当天           | 任何时段（限水2小时）         | 25-50                   |  
| 疑似着床出血后48小时   | 下午3-8点尿液               | 50-100                  |  


操作避坑指南  
步骤：  
1. 拆封后1小时内使用  
2. 尿液浸没试纸箭头3秒（非淋尿法）  
3. 平放等待3分钟判读   

常见错误：  
- ✘ 用晚间稀释尿液 → 假阴性率↑30%  
- ✘ 超过5分钟判读 → 蒸发线误判率↑45%  
- ✘ 服用含hCG药物 → 假阳性风险   

结果解读矩阵  

| 显示状态              | 医学解读                     | 后续行动                  |  
|-----------------------|----------------------------|-------------------------|  
| 双红线（即使浅）   | 妊娠阳性                    | 48小时复测+预约β-hCG血检  |  
| 单红线            | 未检测到hCG                 | 经期延迟7天复测           |  
| 无线/模糊带       | 试纸失效                    | 更换品牌重测         |  


特殊场景处理  
- 宫外孕：hCG上升缓慢（每48小时↑＜50%），需结合超声   
- 生化妊娠：试纸转淡+月经来潮，建议查染色体   
- 多囊卵巢：假阳性率＜1%，但需排除激素干扰
            `
          },
          {
            id: 'pregnancy-test-guide',
            title: '早孕试纸的"黄金8小时"法则',
            content: `
精准测试时间表  

| 检测场景               | 最佳尿样时间                  | 检测灵敏度（hCG mIU/mL） |  
|-----------------------|----------------------------|-------------------------|  
| 预期经期前5天          | 晨起第一泡尿                | 10-25                   |  
| 预期经期当天           | 任何时段（限水2小时）         | 25-50                   |  
| 疑似着床出血后48小时   | 下午3-8点尿液               | 50-100                  |  


操作避坑指南  
步骤：  
1. 拆封后1小时内使用  
2. 尿液浸没试纸箭头3秒（非淋尿法）  
3. 平放等待3分钟判读   

常见错误：  
- ✘ 用晚间稀释尿液 → 假阴性率↑30%  
- ✘ 超过5分钟判读 → 蒸发线误判率↑45%  
- ✘ 服用含hCG药物 → 假阳性风险   

结果解读矩阵  

| 显示状态              | 医学解读                     | 后续行动                  |  
|-----------------------|----------------------------|-------------------------|  
| 双红线（即使浅）   | 妊娠阳性                    | 48小时复测+预约β-hCG血检  |  
| 单红线            | 未检测到hCG                 | 经期延迟7天复测           |  
| 无线/模糊带       | 试纸失效                    | 更换品牌重测         |  


特殊场景处理  
- 宫外孕：hCG上升缓慢（每48小时↑＜50%），需结合超声   
- 生化妊娠：试纸转淡+月经来潮，建议查染色体   
- 多囊卵巢：假阳性率＜1%，但需排除激素干扰
            `
          }
        ]
      }
    }
  };

  const t = translations[language];

  const calculatePregnancy = () => {
    if (!lastPeriodDate) return;

    // 添加日期验证逻辑
    const lastPeriodYear = new Date(lastPeriodDate).getFullYear();
    if (lastPeriodYear < 1950 || lastPeriodYear > 3000) {
      setErrorMessage(language === 'zh' ? 
        '请输入1950年至3000年之间的日期' : 
        'Please enter a date between 1950 and 3000');
      // 清空无效日期
      setLastPeriodDate('');
      // 清空预测结果
      setPregnancyInfo(null);
      // 从localStorage移除无效数据
      localStorage.removeItem('pregnancyData');
      return;
    }

    // 创建日期时使用本地时间
    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 计算怀孕天数（从最后一次月经开始）
    const pregnancyDays = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 加1包含最后一次月经的第一天
    const pregnancyWeeks = Math.floor(pregnancyDays / 7);
    const remainingDays = pregnancyDays % 7;

    // 计算预产期（最后一次月经后280天）
    const dueDate = new Date(lastPeriod);
    dueDate.setDate(dueDate.getDate() + 280);

    // 确定孕期阶段
    let stage = t.stages.early;
    if (pregnancyWeeks >= 27) {
      stage = t.stages.late;
    } else if (pregnancyWeeks >= 13) {
      stage = t.stages.middle;
    }

    // 生成关键时间点
    const milestones: PregnancyMilestone[] = [];
    const addDays = (date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      // 确保日期使用本地时间
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    // 修改里程碑日期生成逻辑
    const createMilestone = (week: number, title: string, description: string, type: PregnancyMilestone['type'], priority: number) => {
      const date = new Date(lastPeriod);
      date.setDate(date.getDate() + (week * 7));
      return {
        week,
        date: formatDate(date),
        title,
        description,
        type,
        priority
      };
    };

    // 添加发育里程碑
    t.development.items.forEach(({ week, title, description }) => {
      milestones.push(createMilestone(week, title, description, 'development', 2));
    });

    // 添加产检时间点
    t.checkups.items.forEach(({ week, title, description }) => {
      milestones.push(createMilestone(week, title, description, 'checkup', 1));
    });

    // 添加健康提醒
    t.health.items.forEach(({ week, title, description }) => {
      milestones.push(createMilestone(week, title, description, 'health', 3));
    });

    // 添加警告信息
    t.warnings.items.forEach(({ week, title, description }) => {
      milestones.push(createMilestone(week, title, description, 'warning', 0));
    });

    // 添加过期妊娠风险期警告
    const postTermDate = addDays(dueDate, 14);
    milestones.push({
      week: 42,
      date: formatDate(postTermDate),
      title: language === 'zh' ? '过期妊娠风险期' : 'Post-term Risk Period',
      description: language === 'zh' ? '建议就医评估分娩计划' : 'Medical evaluation recommended',
      type: 'warning',
      priority: 0
    });

    // 排序里程碑：先按周数，同周按优先级
    milestones.sort((a, b) => {
      if (a.week === b.week) {
        return (a.priority ?? 999) - (b.priority ?? 999);
      }
      return a.week - b.week;
    });

    // 找到下一次产检
    const nextCheckup = milestones
      .filter(m => m.type === 'checkup' && new Date(m.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;

    setPregnancyInfo({
      weeks: pregnancyWeeks,
      days: remainingDays,
      stage,
      dueDate: formatDate(dueDate),
      milestones,
      nextCheckup
    });
  };

  const generateCalendarDays = (year: number, month: number, milestones: PregnancyMilestone[] = []): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];
    
    // 获取第一天是周几（0是周日，1是周一，以此类推）
    const firstDayOfWeek = firstDay.getDay();
    // 调整为以周一为第一天（0是周一，6是周日）
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // 添加上个月的日期
    const prevMonthLastDay = new Date(year, month, 0);
    
    for (let i = adjustedFirstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
      const dateStr = formatDate(date);
      const milestone = milestones.find(m => m.date === dateStr);
      
      days.push({
        date,
        isCurrentMonth: false,
        hasEvent: !!milestone,
        eventType: milestone?.type,
        eventTitle: milestone?.title,
        isToday: false
      });
    }
    
    // 添加当前月的日期
    for (let date = 1; date <= lastDay.getDate(); date++) {
      const currentDate = new Date(year, month, date);
      const dateStr = formatDate(currentDate);
      const milestone = milestones.find(m => m.date === dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = formatDate(currentDate) === formatDate(today);
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        hasEvent: !!milestone,
        eventType: milestone?.type,
        eventTitle: milestone?.title,
        isToday
      });
    }
    
    // 添加下个月的日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = formatDate(date);
      const milestone = milestones.find(m => m.date === dateStr);
      
      days.push({
        date,
        isCurrentMonth: false,
        hasEvent: !!milestone,
        eventType: milestone?.type,
        eventTitle: milestone?.title,
        isToday: false
      });
    }
    
    return days;
  };

  const calendarDays = useMemo(() => {
    if (!pregnancyInfo) return generateCalendarDays(currentViewMonth.getFullYear(), currentViewMonth.getMonth());
    return generateCalendarDays(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), pregnancyInfo.milestones);
  }, [currentViewMonth, pregnancyInfo]);

  const prevMonth = () => {
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
  };

  const nextMonth = () => {
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
  };

  // 添加回到今天按钮的处理函数
  const resetToCurrentMonth = () => {
    setCurrentViewMonth(new Date());
  };

  // 当语言改变时重新计算
  const handleLanguageChange = (newLanguage: 'en' | 'zh') => {
    if (lastPeriodDate) {
      // 保存当前数据
      const currentData = {
        lastPeriodDate,
        currentViewMonth
      };
      
      // 延迟执行以确保语言状态已更新
      setTimeout(() => {
        setLastPeriodDate(currentData.lastPeriodDate);
        setCurrentViewMonth(currentData.currentViewMonth);
        calculatePregnancy();
      }, 0);
    }
  };

  // 添加鼠标移动事件监听
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedEvent) {
        setMousePosition({
          x: e.clientX + 20, // 鼠标右侧20px
          y: e.clientY + 20  // 鼠标下方20px
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [selectedEvent]);

  // 修改 EventPopup 组件
  const EventPopup = ({ event, onClose }: { event: EventPopup; onClose: () => void }) => {
    // 计算弹出框位置，确保不超出视口
    const popupPosition = {
      left: Math.min(mousePosition.x, window.innerWidth - 320), // 减小宽度到320px
      top: Math.min(mousePosition.y, window.innerHeight - 100)  // 确保顶部有足够空间
    };

    return (
      <div 
        className="fixed z-50"
        style={{
          left: `${popupPosition.left}px`,
          top: `${popupPosition.top}px`
        }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl p-4 w-[320px] border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-3">
            {language === 'zh' 
              ? `${event.date.split('-')[1]}月${event.date.split('-')[2]}日的事件`
              : new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })
            }
          </h3>
          <div className="space-y-2">
            {event.events.map((milestone, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  milestone.type === 'development'
                    ? 'bg-green-50'
                    : milestone.type === 'checkup'
                    ? 'bg-blue-50'
                    : milestone.type === 'health'
                    ? 'bg-orange-50'
                    : milestone.type === 'warning'
                    ? 'bg-red-50'
                    : 'bg-purple-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      milestone.type === 'development'
                        ? 'bg-green-400'
                        : milestone.type === 'checkup'
                        ? 'bg-blue-400'
                        : milestone.type === 'health'
                        ? 'bg-orange-400'
                        : milestone.type === 'warning'
                        ? 'bg-red-400'
                        : 'bg-purple-400'
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm mb-1 ${
                      milestone.type === 'development'
                        ? 'text-green-700'
                        : milestone.type === 'checkup'
                        ? 'text-blue-700'
                        : milestone.type === 'health'
                        ? 'text-orange-700'
                        : milestone.type === 'warning'
                        ? 'text-red-700'
                        : 'text-purple-700'
                    }`}>
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{milestone.description}</p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span className="font-medium">
                        {language === 'zh' ? '孕周：' : 'Week: '}
                      </span>
                      <span className="px-1.5 py-0.5 bg-white rounded text-xs">
                        {milestone.week} {t.weeks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 修改日历格子的鼠标事件处理
  const handleDayMouseEnter = (day: CalendarDay, event: React.MouseEvent) => {
    if (!day.hasEvent) return;
    
    const dateStr = formatDate(day.date);
    const events = pregnancyInfo?.milestones.filter(m => m.date === dateStr) || [];
    
    if (events.length > 0) {
      setSelectedEvent({
        date: dateStr,
        events,
        position: {
          x: event.clientX + 20,
          y: event.clientY + 20
        }
      });
    }
  };

  const handleDayMouseLeave = (event: React.MouseEvent) => {
    const target = event.currentTarget;
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    // 只有当鼠标移出日历格子且不是移动到弹出框时才关闭
    if (!target.contains(relatedTarget) && !relatedTarget?.closest('.popup-content')) {
      setSelectedEvent(null);
    }
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

  // 修改处理经期日期失去焦点的验证
  const handlePeriodDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    
    // 验证日期是否在有效范围内（1950-3000年）
    if (dateStr) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      
      if (year < 1950 || year > 3000) {
        // 替换 alert 为自定义错误提示
        setErrorMessage(language === 'zh' ? 
          '请输入1950年至3000年之间的日期' : 
          'Please enter a date between 1950 and 3000');
        // 清空无效日期
        setLastPeriodDate('');
        // 清空预测结果
        setPregnancyInfo(null);
        // 从localStorage移除无效数据
        localStorage.removeItem('pregnancyData');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative touch-auto bg-transparent overflow-hidden">
      {errorMessage && (
        <ErrorModal 
          message={errorMessage} 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      {selectedEvent && (
        <EventPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
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
            <h1 className="text-4xl font-bold mb-4 text-pink-600">{t.title}</h1>
            <p className="text-xl text-gray-600">{t.subtitle}</p>
          </div>

          {/* 计算器 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.lastPeriod}
                </label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={lastPeriodDate}
                  onChange={(e) => {
                    // 仅更新日期值，不进行验证
                    setLastPeriodDate(e.target.value);
                  }}
                  onBlur={handlePeriodDateBlur}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={calculatePregnancy}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  {t.calculate}
                </button>
              </div>
            </div>

            {pregnancyInfo && (
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-pink-50 rounded-lg p-4">
                    <p className="font-medium text-gray-600">
                      {language === 'zh' ? '怀孕周期' : 'Pregnancy Progress'}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-pink-600">
                      {formatWeeks(pregnancyInfo.weeks, pregnancyInfo.days)}
                    </p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <p className="font-medium text-gray-600">{t.stage}</p>
                    <p className="text-xl sm:text-2xl font-bold text-pink-600">{pregnancyInfo.stage}</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <p className="font-medium text-gray-600">{t.dueDate}</p>
                    <p className="text-xl sm:text-2xl font-bold text-pink-600">{pregnancyInfo.dueDate}</p>
                  </div>
                  {pregnancyInfo.nextCheckup && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="font-medium text-gray-600">{t.nextCheckup}</p>
                      <p className="text-lg font-bold text-purple-600">
                        {pregnancyInfo.nextCheckup.date}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        {pregnancyInfo.nextCheckup.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 日历视图 */}
          {pregnancyInfo && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {/* 进度条 */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {language === 'zh' ? '孕期进度' : 'Pregnancy Progress'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.min(Math.round((pregnancyInfo.weeks / 40) * 100), 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(Math.round((pregnancyInfo.weeks / 40) * 100), 100)}%` }}
                  />
                </div>
                {/* 风险期指示器 */}
                {pregnancyInfo.weeks <= 12 && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-red-600">
                        {language === 'zh' ? '早期流产风险期' : 'Early Miscarriage Risk Period'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {language === 'zh' 
                          ? `第${pregnancyInfo.weeks}周，风险${Math.max(20 - pregnancyInfo.weeks * 1.5, 5)}%` 
                          : `Week ${pregnancyInfo.weeks}, Risk ${Math.max(20 - pregnancyInfo.weeks * 1.5, 5)}%`}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(20 - pregnancyInfo.weeks * 1.5, 5)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 日历标题和导航 */}
              <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <button onClick={prevMonth} className="p-3 hover:bg-pink-50 rounded-full transition-colors touch-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-pink-600">
                    {currentViewMonth.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { 
                      year: 'numeric', 
                      month: 'long'
                    })}
                  </h2>
                  {/* 添加回到今天按钮 */}
                  <button 
                    onClick={resetToCurrentMonth} 
                    className="ml-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-gray-600 text-sm flex items-center touch-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {language === 'zh' ? '返回今天' : 'Back toToday'}
                  </button>
                </div>
                
                <button onClick={nextMonth} className="p-3 hover:bg-pink-50 rounded-full transition-colors touch-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* 图例 - 移动到日历下方，在移动端更易于查看 */}
              <div className="flex flex-wrap justify-center gap-3 mb-4 mt-2 text-xs">
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span>
                  <span>{t.milestones.checkup}</span>
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span>
                  <span>{t.milestones.development}</span>
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300"></span>
                  <span>{t.milestones.health}</span>
                </span>
                <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                  <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span>
                  <span>{t.milestones.warning}</span>
                </span>
              </div>

              {/* 日历网格 */}
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {/* 星期标题 */}
                {(language === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
                  .map((day, i) => (
                    <div key={i} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}

                {/* 日历格子 */}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`bg-white p-2 min-h-[80px] ${
                      !day.isCurrentMonth ? 'text-gray-400' : ''
                    } ${day.isToday ? 'bg-blue-50' : ''} ${
                      day.hasEvent ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onMouseEnter={(e) => handleDayMouseEnter(day, e)}
                    onMouseLeave={handleDayMouseLeave}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-sm ${day.isToday ? 'font-bold text-blue-600' : ''}`}>
                        {day.date.getDate()}
                      </span>
                      {day.hasEvent && (
                        <div className={`mt-1 p-1 rounded text-xs ${
                          day.eventType === 'development'
                            ? 'bg-green-100 text-green-700'
                            : day.eventType === 'checkup'
                            ? 'bg-blue-100 text-blue-700'
                            : day.eventType === 'health'
                            ? 'bg-orange-100 text-orange-700'
                            : day.eventType === 'warning'
                            ? 'bg-red-100 text-red-700'
                            : day.eventType === 'twin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {day.eventTitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 孕期时间轴 */}
          {pregnancyInfo && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-pink-600">{t.milestones.title}</h2>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  {pregnancyInfo.milestones.map((milestone, index) => {
                    const isPast = new Date(milestone.date) < new Date();
                    const isToday = milestone.date === new Date().toISOString().split('T')[0];

                    return (
                      <div 
                        key={index}
                        className={`relative flex items-start gap-6 ${
                          index === pregnancyInfo.milestones.length - 1 ? '' : 'pb-8'
                        }`}
                      >
                        <div 
                          className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${
                            isPast 
                              ? milestone.type === 'development'
                                ? 'bg-pink-100 border-pink-300'
                                : milestone.type === 'checkup'
                                ? 'bg-purple-100 border-purple-300'
                                : milestone.type === 'health'
                                ? 'bg-orange-100 border-orange-300'
                                : milestone.type === 'warning'
                                ? 'bg-red-100 border-red-300'
                                : 'bg-purple-100 border-purple-300'
                              : isToday
                              ? 'bg-white border-blue-400 shadow-lg'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className={`text-base font-semibold ${
                            isPast 
                              ? milestone.type === 'development'
                                ? 'text-pink-700'
                                : milestone.type === 'checkup'
                                ? 'text-purple-700'
                                : milestone.type === 'health'
                                ? 'text-orange-700'
                                : milestone.type === 'warning'
                                ? 'text-red-700'
                                : 'text-purple-700'
                              : isToday
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}>
                            {milestone.week}
                            <span className="text-xs ml-0.5">{t.weeks}</span>
                          </div>
                          <div className={`text-xs mt-0.5 ${
                            isPast ? 'text-gray-600' : isToday ? 'text-blue-500' : 'text-gray-400'
                          }`}>
                            {language === 'zh' 
                              ? new Date(milestone.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '月') + '日'
                              : new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }
                          </div>
                        </div>
                        <div className={`flex-grow ${isPast ? 'opacity-100' : 'opacity-50'}`}>
                          <div className={`text-sm font-medium mb-1 ${
                            milestone.type === 'development'
                              ? 'text-pink-600'
                              : milestone.type === 'checkup'
                              ? 'text-purple-600'
                              : milestone.type === 'health'
                              ? 'text-orange-600'
                              : milestone.type === 'warning'
                              ? 'text-red-600'
                              : 'text-purple-600'
                          }`}>
                            {milestone.title}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 科普文章部分 - 移到最底部 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-pink-600">{t.articles.title}</h2>
            <div className="space-y-6">
              {t.articles.items.map((article, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedArticles(prev => ({
                      ...prev,
                      [article.id]: !prev[article.id]
                    }))}
                    className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
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
                          if (section.startsWith('####')) {
                            return (
                              <h4 key={i} className="text-base font-semibold mt-6 mb-3 text-gray-700 border-b pb-2">
                                {section.replace(/[#*]/g, '').trim()}
                              </h4>
                            );
                          } else if (section.startsWith('|')) {
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
                                                {cell.trim().replace(/[*]/g, '')}
                                              </th>
                                            ))}
                                          </tr>
                                        );
                                      } else {
                                        return (
                                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            {cells.map((cell, cellIndex) => (
                                              <td key={cellIndex} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-200">
                                                {cell.trim().replace(/[*]/g, '')}
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
                          } else if (section.startsWith('步骤') || section.startsWith('常见错误')) {
                            const title = section.match(/步骤|常见错误/)?.[0] || '';
                            const items = section.replace(/[*]|步骤：|常见错误：/, '').split('\n').filter(item => item.trim());
                            return (
                              <div key={i} className="my-4">
                                <h5 className="font-medium text-gray-700 mb-2">{title}：</h5>
                                <ul className="list-none space-y-2">
                                  {items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                      {item.startsWith('✘') ? (
                                        <>
                                          <span className="text-red-500 font-bold">✘</span>
                                          <span>{item.replace('✘', '').trim()}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-gray-400">{itemIndex + 1}.</span>
                                          <span>{item.trim()}</span>
                                        </>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          } else if (section.startsWith('-')) {
                            const items = section.split('\n').filter(item => item.trim());
                            return (
                              <ul key={i} className="list-none space-y-2 my-4">
                                {items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                                    <span className="text-gray-400">•</span>
                                    <span>{item.replace(/^-\s+|\*\*/g, '').trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          } else if (section.match(/^\d+\./)) {
                            const items = section.split('\n').filter(item => item.trim());
                            return (
                              <ol key={i} className="list-decimal pl-5 my-4 space-y-2">
                                {items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="text-sm text-gray-600">
                                    {item.replace(/^\d+\.\s+|\*\*/g, '').trim()}
                                  </li>
                                ))}
                              </ol>
                            );
                          } else {
                            return <p key={i} className="my-3 text-sm text-gray-600 leading-relaxed">{section.replace(/[*]/g, '')}</p>;
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