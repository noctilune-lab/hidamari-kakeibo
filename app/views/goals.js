// #/goals — savings goals: progress, remaining, monthly saving needed for the deadline, and a 12-month projection.

import { GOALS, CURRENT_MONTH } from '../data.js';
import { goalPlan, monthSummary, plannedSaving } from '../calc.js';
import { yen, pct, monthLabel, esc } from '../format.js';
import { progress } from '../charts.js';
import { pageHead, stat } from '../ui.js';

export function render(state) {
  const plans = GOALS.map((g) => goalPlan(g, state.contrib[g.id]));
  const needed = GOALS.map((g) => goalPlan(g));
  const totalSaved = plans.reduce((t, p) => t + p.saved, 0);
  const totalTarget = plans.reduce((t, p) => t + p.target, 0);
  const totalNeeded = needed.reduce((t, p) => t + p.needed, 0);
  const totalContrib = plans.reduce((t, p) => t + p.contribution, 0);
  const cur = monthSummary(state.entries, CURRENT_MONTH);

  const cards = plans.map((p, i) => `<article class="card goal">
    <header><h2>${esc(p.name)}</h2><span class="deadline">期限 ${monthLabel(p.deadline)}</span></header>
    <p class="memo">${esc(p.memo)}</p>
    <div class="gbig"><strong class="num">${yen(p.saved)}</strong><span>/ 目標 ${yen(p.target)}</span><b>${pct(p.saved, p.target, 1)}</b></div>
    ${progress(p.progress, p.name + 'の達成率')}
    <dl class="kv">
      <div><dt>あと必要な額</dt><dd class="num">${yen(p.remaining)}</dd></div>
      <div><dt>期限まで</dt><dd>${p.monthsLeft} か月（${monthLabel('2026-12')}〜）</dd></div>
      <div><dt>期限に間に合う月々の積立</dt><dd class="num strong">${yen(needed[i].needed)}</dd></div>
    </dl>
    <label class="contrib">月々の積立額を試す（円）
      <input type="number" min="0" max="500000" step="500" value="${p.contribution}" data-goal="${p.id}" inputmode="numeric"></label>
    <dl class="kv proj">
      <div><dt>1年間の積立（月額×12）</dt><dd class="num strong">${yen(p.yearly)}</dd></div>
      <div><dt>12か月後の残高</dt><dd class="num">${yen(p.after12)}</dd></div>
      <div><dt>達成の見込み</dt><dd class="${p.onTime ? 'pos' : 'neg'}">${p.finishMonth ? monthLabel(p.finishMonth) + (p.onTime ? '（期限内）' : '（期限を過ぎます）') : '積立が0円のため未定'}</dd></div>
    </dl>
  </article>`).join('');

  return `${pageHead('貯蓄目標', 'ためたい目的ごとに、いくら貯まっていて、期限までに毎月いくら必要かを計算します。積立額を変えると1年後の見込みも変わります。')}
  <section class="stats three" aria-label="目標の合計">
    ${stat('貯まった額（3目標）', yen(totalSaved), `目標合計 ${yen(totalTarget)} の ${pct(totalSaved, totalTarget)}`)}
    ${stat('期限に間に合う月額の合計', yen(totalNeeded), '3目標の必要額の合計', 'accent')}
    ${stat('いま試している積立の合計', yen(totalContrib), `計画貯蓄 ${yen(plannedSaving())} の ${pct(totalContrib, plannedSaving())}`)}
  </section>
  <div class="goalgrid">${cards}</div>
  <section class="card soft">
    <h2>今月の貯蓄とのバランス</h2>
    <p>${monthLabel(CURRENT_MONTH)}の貯蓄額は ${yen(cur.saving)}。3つの目標に毎月 ${yen(totalContrib)} を積み立てると、残り <strong class="num">${yen(cur.saving - totalContrib)}</strong> が予備費や自由に使える貯蓄に回せます。</p>
    <button type="button" class="linkbtn" id="contrib-reset">積立額を「期限に間に合う額」に戻す</button>
  </section>`;
}

export function bind(root, store) {
  root.querySelectorAll('[data-goal]').forEach((input) => {
    input.addEventListener('change', () => {
      const v = Math.max(0, Math.round(Number(input.value) || 0));
      store.set({ contrib: { ...store.get().contrib, [input.dataset.goal]: v } });
    });
  });
  root.querySelector('#contrib-reset').addEventListener('click', () => store.set({ contrib: {} }));
}
