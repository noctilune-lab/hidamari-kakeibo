// #/ — the month at a glance: headline figures, category chart, three-month trend, goals and links.

import { HOUSEHOLD, MONTHS, GOALS } from '../data.js';
import { monthSummary, plannedTotal, plannedSaving, goalPlan } from '../calc.js';
import { yen, signedYen, pct, monthLabel, esc } from '../format.js';
import { categoryBars, splitBar, trendColumns, progress } from '../charts.js';
import { stat, pageHead, linkCards } from '../ui.js';

export function render(state) {
  const s = monthSummary(state.entries, state.month);
  const sorted = [...s.rows].sort((a, b) => b.actual - a.actual);
  const over = s.rows.filter((r) => r.diff > 0).sort((a, b) => b.diff - a.diff);
  const under = s.rows.filter((r) => r.diff < 0).sort((a, b) => a.diff - b.diff);
  const trend = MONTHS.map((m) => monthSummary(state.entries, m));
  const goals = GOALS.map((g) => goalPlan(g));
  const spendClass = s.diff > 0 ? 'warn' : 'good';

  return `${pageHead(`${monthLabel(state.month)}の家計`, `${esc(HOUSEHOLD.label)}。手取りから何にいくら使い、いくら残せたかを一目で確認できます。`)}
  <section class="stats" aria-label="今月の主な数字">
    ${stat('手取り収入', yen(HOUSEHOLD.takeHome), '月額（固定）')}
    ${stat('予算（支出）', yen(plannedTotal()), `12費目の合計 ／ 計画貯蓄 ${yen(plannedSaving())}`)}
    ${stat('実際の支出', yen(s.spending), `予算比 ${signedYen(s.diff)}`, spendClass)}
    ${stat('貯蓄額', yen(s.saving), `計画との差 ${signedYen(s.saving - plannedSaving())}`, 'accent')}
    ${stat('貯蓄率', pct(s.saving, HOUSEHOLD.takeHome), `計画 ${pct(plannedSaving(), HOUSEHOLD.takeHome)}`, 'accent')}
  </section>
  <div class="grid2">
    <section class="card">
      <h2>手取りの使い道</h2>
      ${splitBar(s.spending, s.saving, HOUSEHOLD.takeHome)}
      <h2 class="mt">費目別の実績 <small>棒＝実績 ／ 縦線＝予算 ／ 橙＝予算超過</small></h2>
      ${categoryBars(sorted)}
    </section>
    <div class="col">
      <section class="card">
        <h2>3か月の推移 <small>支出と貯蓄</small></h2>
        ${trendColumns(trend, plannedTotal())}
        <p class="legend"><span class="k kA"></span>支出 <span class="k kB"></span>貯蓄 ／ 貯蓄率 ${trend.map((t) => pct(t.saving, HOUSEHOLD.takeHome)).join(' → ')}</p>
      </section>
      <section class="card">
        <h2>気づき <small>${monthLabel(state.month)}</small></h2>
        <ul class="notes">
          <li>予算を超えた費目：${over.length ? over.map((r) => `${esc(r.name)} <b class="neg">${signedYen(r.diff)}</b>`).join('、') : 'なし'}</li>
          <li>予算内に収めた費目：${under.length ? under.map((r) => `${esc(r.name)} <b class="pos">${signedYen(r.diff)}</b>`).join('、') : 'なし'}</li>
          <li>記録した支出 ${s.count} 件の合計が実際の支出 ${yen(s.spending)} です。</li>
        </ul>
      </section>
    </div>
  </div>
  <section class="card">
    <h2>貯蓄目標 <a class="more" href="#/goals">詳しく見る →</a></h2>
    <div class="goalmini">${goals.map((g) => `<div><div class="gm-head"><strong>${esc(g.name)}</strong><span class="num">${yen(g.saved)} / ${yen(g.target)}</span></div>${progress(g.progress, g.name + 'の達成率')}<span class="gm-sub">${pct(g.saved, g.target, 0)} 達成 ・ 残り ${yen(g.remaining)}</span></div>`).join('')}</div>
  </section>
  ${linkCards()}`;
}
