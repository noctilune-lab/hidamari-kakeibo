// #/expenses — the ledger of entries for the chosen month: filter, sort, add, delete.

import { CATEGORIES } from '../data.js';
import { monthSummary } from '../calc.js';
import { yen, monthLabel, dateLabel, esc } from '../format.js';
import { pageHead, stat } from '../ui.js';

const SORTS = {
  'date-desc': ['日付の新しい順', (a, b) => b.date.localeCompare(a.date) || b.amount - a.amount],
  'date-asc': ['日付の古い順', (a, b) => a.date.localeCompare(b.date) || b.amount - a.amount],
  'amount-desc': ['金額の大きい順', (a, b) => b.amount - a.amount],
  'amount-asc': ['金額の小さい順', (a, b) => a.amount - b.amount],
};
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

export function render(state) {
  const { month, filter, sort } = state;
  const s = monthSummary(state.entries, month);
  const inMonth = state.entries.filter((e) => e.date.startsWith(month));
  const shown = inMonth.filter((e) => filter === 'all' || e.category === filter).sort((a, b) => SORTS[sort][1](a, b) || a.id.localeCompare(b.id));
  const shownTotal = shown.reduce((t, e) => t + e.amount, 0);
  const lastDay = new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate();
  const defaultDate = month === '2026-11' ? '2026-11-27' : `${month}-${String(lastDay).padStart(2, '0')}`;
  const rows = shown.map((e) => `<tr>
      <td class="num">${dateLabel(e.date)}</td><td><span class="chip">${esc(catName(e.category))}</span></td>
      <td>${esc(e.note || '（メモなし）')}</td><td class="num strong">${yen(e.amount)}</td>
      <td class="act"><button type="button" class="del" data-del="${esc(e.id)}" aria-label="${esc(dateLabel(e.date) + ' ' + (e.note || catName(e.category)) + ' を削除')}">削除</button></td></tr>`).join('');

  return `${pageHead(`${monthLabel(month)}の支出の記録`, '日々の支出を1件ずつ記録します。追加・削除すると、概要・予算・年間の合計もすぐに変わります。')}
  <section class="stats three" aria-label="今月の合計">
    ${stat('記録した件数', `${s.count} 件`, monthLabel(month))}
    ${stat('実際の支出 合計', yen(s.spending), `全費目の明細の合計`, 'accent')}
    ${stat('貯蓄額', yen(s.saving), '手取り − 支出')}
  </section>
  <div class="grid2 wide-left">
    <section class="card tablecard">
      <h2>支出の明細</h2>
      <div class="toolbar">
        <label>費目 <select id="f-cat"><option value="all">すべての費目</option>${CATEGORIES.map((c) => `<option value="${c.id}"${filter === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
        <label>並べ替え <select id="f-sort">${Object.entries(SORTS).map(([k, [t]]) => `<option value="${k}"${sort === k ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
      </div>
      <div class="tablewrap"><table class="ledger log">
        <thead><tr><th scope="col" class="num">日付</th><th scope="col">費目</th><th scope="col">メモ</th><th scope="col" class="num">金額</th><th scope="col"><span class="vh">操作</span></th></tr></thead>
        <tbody>${rows || '<tr><td colspan="5" class="emptyrow">この条件に合う支出はありません。</td></tr>'}</tbody>
        <tfoot><tr><th scope="row" colspan="3">${filter === 'all' ? '月の合計' : esc(catName(filter)) + ' の合計'}（${shown.length} 件）</th><td class="num strong">${yen(shownTotal)}</td><td></td></tr></tfoot>
      </table></div>
    </section>
    <div class="col">
      <section class="card">
        <h2>支出を追加</h2>
        <form id="add" class="form" autocomplete="off">
          <label>日付<input type="date" name="date" required min="${month}-01" max="${month}-${lastDay}" value="${defaultDate}"></label>
          <label>費目<select name="category" required>${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
          <label>メモ<input type="text" name="note" maxlength="40" placeholder="例：スーパー"></label>
          <label>金額（円）<input type="number" name="amount" required min="1" max="9999999" step="1" inputmode="numeric" placeholder="例：3200"></label>
          <button type="submit" class="primary">追加する</button>
          <p class="hint" id="add-msg" role="status">${monthLabel(month)}の日付だけ入力できます。</p>
        </form>
      </section>
      <section class="card">
        <h2>費目ごとの合計</h2>
        <ul class="subtotals">${s.rows.map((r) => `<li><button type="button" class="linkbtn${filter === r.id ? ' on' : ''}" data-cat="${r.id}">${esc(r.name)}</button><span class="num">${yen(r.actual)}</span></li>`).join('')}
        <li class="sum"><span>合計</span><span class="num">${yen(s.spending)}</span></li></ul>
      </section>
    </div>
  </div>`;
}

export function bind(root, store) {
  root.querySelector('#f-cat').addEventListener('change', (e) => store.set({ filter: e.target.value }));
  root.querySelector('#f-sort').addEventListener('change', (e) => store.set({ sort: e.target.value }));
  root.querySelectorAll('[data-cat]').forEach((b) => b.addEventListener('click', () => store.set({ filter: store.get().filter === b.dataset.cat ? 'all' : b.dataset.cat })));
  root.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => store.deleteEntry(b.dataset.del)));
  root.querySelector('#add').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const amount = Math.round(Number(f.get('amount')));
    const date = String(f.get('date'));
    const month = store.get().month;
    const msg = root.querySelector('#add-msg');
    if (!date.startsWith(month)) { msg.textContent = `${monthLabel(month)}の日付を入力してください。`; return; }
    if (!(amount > 0)) { msg.textContent = '金額は1円以上で入力してください。'; return; }
    store.addEntry({ date, category: String(f.get('category')), note: String(f.get('note')).trim(), amount });
  });
}
