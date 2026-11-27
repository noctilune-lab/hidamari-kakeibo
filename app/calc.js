// All derived figures. Every total is a sum over the entry list or the planned categories; nothing is typed in twice.

import { CATEGORIES, HOUSEHOLD, MONTHS, YEAR_MONTHS, CURRENT_MONTH } from './data.js';

const sum = (list, pick) => list.reduce((t, x) => t + pick(x), 0);

export const plannedTotal = () => sum(CATEGORIES, (c) => c.planned);
export const plannedSaving = () => HOUSEHOLD.takeHome - plannedTotal();

export function categoryRows(entries, month) {
  const inMonth = entries.filter((e) => e.date.startsWith(month));
  const actualTotal = sum(inMonth, (e) => e.amount);
  return CATEGORIES.map((c) => {
    const items = inMonth.filter((e) => e.category === c.id);
    const actual = sum(items, (e) => e.amount);
    return { ...c, actual, count: items.length, diff: actual - c.planned, share: actualTotal ? actual / actualTotal : 0 };
  });
}

export function monthSummary(entries, month) {
  const rows = categoryRows(entries, month);
  const spending = sum(rows, (r) => r.actual);
  const saving = HOUSEHOLD.takeHome - spending;
  return {
    month, rows, spending, saving,
    planned: plannedTotal(),
    diff: spending - plannedTotal(),
    rate: saving / HOUSEHOLD.takeHome,
    count: sum(rows, (r) => r.count),
  };
}

// Twelve months: months with entries are actuals, the rest repeat the plan.
export function yearRows(entries) {
  return YEAR_MONTHS.map((month) => {
    const real = MONTHS.includes(month);
    const spending = real ? monthSummary(entries, month).spending : plannedTotal();
    const saving = HOUSEHOLD.takeHome - spending;
    return { month, real, takeHome: HOUSEHOLD.takeHome, spending, saving, rate: saving / HOUSEHOLD.takeHome };
  });
}

export function yearTotals(rows) {
  const takeHome = sum(rows, (r) => r.takeHome);
  const spending = sum(rows, (r) => r.spending);
  const saving = takeHome - spending;
  return { takeHome, spending, saving, rate: saving / takeHome };
}

export function yearByCategory(entries) {
  return CATEGORIES.map((c) => {
    let total = 0;
    for (const m of YEAR_MONTHS) {
      total += MONTHS.includes(m) ? categoryRows(entries, m).find((r) => r.id === c.id).actual : c.planned;
    }
    return { ...c, yearPlanned: c.planned * YEAR_MONTHS.length, yearTotal: total };
  });
}

const monthIndex = (m) => Number(m.slice(0, 4)) * 12 + Number(m.slice(5)) - 1;
export const monthsBetween = (from, to) => monthIndex(to) - monthIndex(from);
export const addMonths = (m, n) => {
  const i = monthIndex(m) + n;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`;
};

// Saving for a goal runs from the month after CURRENT_MONTH through its deadline month.
export function goalPlan(goal, contribution) {
  const remaining = Math.max(goal.target - goal.saved, 0);
  const monthsLeft = monthsBetween(CURRENT_MONTH, goal.deadline);
  const needed = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining;
  const c = contribution ?? needed;
  const monthsToFinish = c > 0 ? Math.ceil(remaining / c) : null;
  return {
    ...goal, remaining, monthsLeft, needed,
    contribution: c,
    progress: goal.target ? goal.saved / goal.target : 0,
    yearly: c * 12,
    after12: Math.min(goal.saved + c * 12, goal.target),
    finishMonth: monthsToFinish === null ? null : addMonths(CURRENT_MONTH, monthsToFinish),
    onTime: monthsToFinish !== null && monthsToFinish <= monthsLeft,
  };
}
