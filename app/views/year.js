// #/year — twelve months from 2026-09: three real months, nine planned; yearly totals, chart and category totals.

import { HOUSEHOLD, MONTHS } from '../data.js';
import { yearRows, yearTotals, yearByCategory, plannedSaving } from '../calc.js';
import { yen, signedYen, pct, monthLabel, monthShort, esc } from '../format.js';
import { columns } from '../charts.js';
import { pageHead, stat } from '../ui.js';

export function render(state) {
  const rows = yearRows(state.entries);
  const t = yearTotals(rows);
  const cats = yearByCategory(state.entries);
  const catSum = cats.reduce((a, c) => a + c.yearTotal, 0);
  const planYear = cats.reduce((a, c) => a + c.yearPlanned, 0);
  let running = 0;
  const body = rows.map((r) => {
    running += r.saving;
    return `<tr class="${r.real ? '' : 'planrow'}"><th scope="row">${monthLabel(r.month)}</th><td>${r.real ? '実績' : '計画'}</td>
      <td class="num">${yen(r.takeHome)}</td><td class="num">${yen(r.spending)}</td><td class="num strong">${yen(r.saving)}</td>
      <td class="num">${pct(r.saving, r.takeHome)}</td><td class="num">${yen(running)}</td></tr>`;
  }).join('');
  const chart = columns(rows.map((r) => ({ label: monthShort(r.month), a: r.spending, b: r.saving, real: r.real })),
    { max: 400000, aName: '支出', bName: '貯蓄', line: { value: plannedSaving(), label: `計画貯蓄 ${yen(plannedSaving())}` } });

  return `${pageHead('年間ビュー（2026年9月〜2027年8月）', `実績のある${MONTHS.length}か月は記録の合計、残りの${rows.length - MONTHS.length}か月は予算どおりに支出した場合の計画値です。支出を追加・削除するとここも変わります。`)}
  <section class="stats" aria-label="年間の合計">
    ${stat('年間の手取り', yen(t.takeHome), `${yen(HOUSEHOLD.takeHome)} × 12か月`)}
    ${stat('年間の支出', yen(t.spending), `予算どおりなら ${yen(planYear)}`)}
    ${stat('年間の貯蓄', yen(t.saving), `計画どおりなら ${yen(HOUSEHOLD.takeHome * 12 - planYear)}`, 'accent')}
    ${stat('年間の貯蓄率', pct(t.saving, t.takeHome), `計画 ${pct(plannedSaving(), HOUSEHOLD.takeHome)}`, 'accent')}
    ${stat('予算との差（年間）', signedYen(t.spending - planYear), '実績の3か月分の差の合計', t.spending > planYear ? 'warn' : 'good')}
  </section>
  <section class="card">
    <h2>月別の支出と貯蓄 <small>濃い色＝実績 ／ 薄い色＝計画</small></h2>
    ${chart}
    <p class="legend"><span class="k kA"></span>支出 <span class="k kB"></span>貯蓄 ／ 点線は計画貯蓄の月額</p>
  </section>
  <div class="grid2 wide-left">
    <section class="card tablecard">
      <h2>12か月の表</h2>
      <div class="tablewrap"><table class="ledger year">
        <thead><tr><th scope="col">月</th><th scope="col">区分</th><th scope="col" class="num">手取り</th><th scope="col" class="num">支出</th><th scope="col" class="num">貯蓄</th><th scope="col" class="num">貯蓄率</th><th scope="col" class="num">貯蓄の累計</th></tr></thead>
        <tbody>${body}</tbody>
        <tfoot><tr><th scope="row" colspan="2">年間合計</th><td class="num">${yen(t.takeHome)}</td><td class="num">${yen(t.spending)}</td><td class="num strong">${yen(t.saving)}</td><td class="num">${pct(t.saving, t.takeHome)}</td><td class="num">${yen(t.saving)}</td></tr></tfoot>
      </table></div>
    </section>
    <section class="card tablecard">
      <h2>費目別の年間見込み</h2>
      <div class="tablewrap"><table class="ledger">
        <thead><tr><th scope="col">費目</th><th scope="col" class="num">年間予算</th><th scope="col" class="num">年間見込み</th><th scope="col" class="num">差</th></tr></thead>
        <tbody>${cats.map((c) => `<tr><th scope="row">${esc(c.name)}</th><td class="num">${yen(c.yearPlanned)}</td><td class="num">${yen(c.yearTotal)}</td><td class="num ${c.yearTotal > c.yearPlanned ? 'neg' : c.yearTotal < c.yearPlanned ? 'pos' : ''}">${signedYen(c.yearTotal - c.yearPlanned)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><th scope="row">合計</th><td class="num">${yen(planYear)}</td><td class="num strong">${yen(catSum)}</td><td class="num">${signedYen(catSum - planYear)}</td></tr></tfoot>
      </table></div>
    </section>
  </div>`;
}
