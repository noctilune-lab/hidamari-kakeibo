// #/budget — planned against actual for every category, with difference, share and a bar per row.

import { HOUSEHOLD } from '../data.js';
import { monthSummary, plannedTotal } from '../calc.js';
import { yen, signedYen, pct, monthLabel, esc } from '../format.js';
import { stat, pageHead } from '../ui.js';

export function render(state) {
  const s = monthSummary(state.entries, state.month);
  const max = Math.max(...s.rows.map((r) => Math.max(r.actual, r.planned)), 1);
  const planned = plannedTotal();
  const body = s.rows.map((r) => {
    const cls = r.diff > 0 ? 'neg' : r.diff < 0 ? 'pos' : '';
    const flag = r.diff > 0 ? '超過' : r.diff < 0 ? '余裕' : '予算どおり';
    return `<tr>
      <th scope="row">${esc(r.name)}</th>
      <td class="num">${yen(r.planned)}</td>
      <td class="num strong">${yen(r.actual)}</td>
      <td class="num ${cls}">${signedYen(r.diff)} <span class="flag ${cls}">${flag}</span></td>
      <td class="num">${pct(r.actual, s.spending)}</td>
      <td class="barcell"><span class="cb-track"><i class="cb-fill${r.diff > 0 ? ' over' : ''}" style="width:${(r.actual / max) * 100}%"></i><b class="cb-plan" style="left:${(r.planned / max) * 100}%"></b></span></td>
    </tr>`;
  }).join('');
  const ranked = [...s.rows].sort((a, b) => b.diff - a.diff);
  const top = ranked.filter((r) => r.diff > 0).slice(0, 3);
  const room = ranked.filter((r) => r.diff < 0).slice(-3).reverse();

  return `${pageHead(`${monthLabel(state.month)}の予算と実績`, '予算（計画）と実績を費目ごとに並べました。実績は「支出の記録」の明細を合計した値です。')}
  <section class="stats three" aria-label="予算の合計">
    ${stat('予算合計', yen(planned), '12費目の合計')}
    ${stat('実績合計', yen(s.spending), `記録 ${s.count} 件の合計`, s.diff > 0 ? 'warn' : 'good')}
    ${stat('差額（実績−予算）', signedYen(s.diff), s.diff > 0 ? '予算を超過' : s.diff < 0 ? '予算内に収まった' : '予算どおり', s.diff > 0 ? 'warn' : 'good')}
  </section>
  <div class="grid2 wide-left">
    <section class="card tablecard">
      <h2>費目別 予算と実績 <small>棒＝実績 ／ 縦線＝予算</small></h2>
      <div class="tablewrap"><table class="ledger">
        <thead><tr><th scope="col">費目</th><th scope="col" class="num">予算</th><th scope="col" class="num">実績</th><th scope="col" class="num">差額</th><th scope="col" class="num">構成比</th><th scope="col" class="barcol">実績の棒</th></tr></thead>
        <tbody>${body}</tbody>
        <tfoot>
          <tr><th scope="row">支出合計</th><td class="num">${yen(planned)}</td><td class="num strong">${yen(s.spending)}</td><td class="num ${s.diff > 0 ? 'neg' : 'pos'}">${signedYen(s.diff)}</td><td class="num">100.0%</td><td></td></tr>
          <tr><th scope="row">手取り − 支出 ＝ 貯蓄</th><td class="num">${yen(HOUSEHOLD.takeHome - planned)}</td><td class="num strong">${yen(s.saving)}</td><td class="num ${s.saving >= HOUSEHOLD.takeHome - planned ? 'pos' : 'neg'}">${signedYen(s.saving - (HOUSEHOLD.takeHome - planned))}</td><td class="num">${pct(s.saving, HOUSEHOLD.takeHome)}</td><td></td></tr>
        </tfoot>
      </table></div>
    </section>
    <div class="col">
      <section class="card">
        <h2>超過が大きい費目</h2>
        <ul class="notes">${top.length ? top.map((r) => `<li>${esc(r.name)}：予算 ${yen(r.planned)} → 実績 ${yen(r.actual)} <b class="neg">${signedYen(r.diff)}</b></li>`).join('') : '<li>予算を超えた費目はありません。</li>'}</ul>
      </section>
      <section class="card">
        <h2>余裕がある費目</h2>
        <ul class="notes">${room.length ? room.map((r) => `<li>${esc(r.name)}：予算 ${yen(r.planned)} → 実績 ${yen(r.actual)} <b class="pos">${signedYen(r.diff)}</b></li>`).join('') : '<li>予算より少なかった費目はありません。</li>'}</ul>
      </section>
      <section class="card soft">
        <h2>見方</h2>
        <p>差額がプラス（橙）は予算より多く使った費目、マイナス（緑）は予算内に収まった費目です。構成比は実績合計に占める割合です。費目をくわしく見るには <a href="#/expenses">支出の記録</a> で絞り込みます。</p>
      </section>
    </div>
  </div>`;
}
