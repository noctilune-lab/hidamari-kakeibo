// Shell: hash router, header navigation, month switcher and the lazy loading of one view file per page.

import * as store from './store.js';
import { MONTHS } from './data.js';
import { monthLabel, monthShort } from './format.js';

const PAGES = [
  ['', '概要', 'overview'],
  ['budget', '予算', 'budget'],
  ['expenses', '支出', 'expenses'],
  ['goals', '目標', 'goals'],
  ['year', '年間', 'year'],
  ['guide', 'ガイド', 'guide'],
];
const TITLES = { overview: '概要', budget: '予算と実績', expenses: '支出の記録', goals: '貯蓄目標', year: '年間ビュー', guide: '使い方ガイド' };

const app = document.getElementById('app');
let token = 0;

const route = () => PAGES.find(([p]) => p === (location.hash.replace(/^#\/?/, '').split('?')[0])) ?? PAGES[0];

function drawChrome(name) {
  document.getElementById('nav').innerHTML = PAGES
    .map(([p, label, view]) => `<a href="#/${p}"${view === name ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const month = store.get().month;
  document.getElementById('months').innerHTML = MONTHS
    .map((m) => `<button type="button" data-month="${m}" aria-pressed="${m === month}" title="${monthLabel(m)}">${monthShort(m)}</button>`).join('');
}

async function render() {
  const [, , name] = route();
  const mine = ++token;
  drawChrome(name);
  try {
    const view = await import(`./views/${name}.js`);
    if (mine !== token) return;
    app.innerHTML = view.render(store.get());
    view.bind?.(app, store);
    document.title = `${TITLES[name]} — ひだまり家計帳`;
  } catch (err) {
    app.innerHTML = `<p class="loading">ページを表示できませんでした：${String(err.message).replace(/</g, '&lt;')}</p>`;
  }
  window.__shotReady = true;
}

let lastName = null;
const onChange = () => { const [, , n] = route(); const keep = n === lastName ? window.scrollY : 0; render().then(() => window.scrollTo(0, keep)); lastName = n; };

document.getElementById('months').addEventListener('click', (e) => {
  const m = e.target.closest('[data-month]')?.dataset.month;
  if (m) store.set({ month: m });
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('追加・削除した内容を消して、サンプルの状態に戻します。よろしいですか？')) store.reset();
});

store.subscribe(onChange);
window.addEventListener('hashchange', () => { onChange(); app.focus({ preventScroll: true }); });
onChange();
