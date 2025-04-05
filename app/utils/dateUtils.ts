export const calculateOvulationDays = (lastPeriodDate: string, cycleLength: number): Date[] => {
  if (!lastPeriodDate) return [];
  
  const startDate = new Date(lastPeriodDate);
  const ovulationDays: Date[] = [];
  
  // 计算下一个排卵日（通常在下次经期前14天）
  const nextOvulation = new Date(startDate);
  nextOvulation.setDate(nextOvulation.getDate() + cycleLength - 14);
  ovulationDays.push(nextOvulation);
  
  return ovulationDays;
};

export const isOvulationDay = (date: Date, ovulationDays: Date[]): boolean => {
  if (!ovulationDays.length) return false;
  return ovulationDays.some(ovulationDay => 
    ovulationDay.getDate() === date.getDate() &&
    ovulationDay.getMonth() === date.getMonth() &&
    ovulationDay.getFullYear() === date.getFullYear()
  );
};

export const getCurrentCyclePhase = (
  lastPeriodDate: string | null, 
  cycleLength: number, 
  periodLength: number
): 'period' | 'follicular' | 'ovulation' | 'luteal' => {
  if (!lastPeriodDate) return 'follicular';
  
  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastPeriod <= periodLength) {
    return 'period';
  } else if (daysSinceLastPeriod <= cycleLength - 14) {
    return 'follicular';
  } else if (daysSinceLastPeriod <= cycleLength - 7) {
    return 'ovulation';
  } else {
    return 'luteal';
  }
}; 