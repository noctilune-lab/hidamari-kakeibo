// Small shared HTML pieces used by several views.

import { esc } from './format.js';

export const stat = (label, value, sub = '', cls = '') =>
  `<div class="stat ${cls}"><span class="stat-l">${esc(label)}</span><strong class="num">${value}</strong><span class="stat-s">${sub}</span></div>`;

export const pageHead = (title, lead) => `<header class="pagehead"><h1>${esc(title)}</h1><p>${lead}</p></header>`;

export const sectionLinks = [
  ['#/budget', '予算と実績', '12費目の予算・実績・差額・構成比'],
  ['#/expenses', '支出の記録', '追加・削除・絞り込み・並べ替え'],
  ['#/goals', '貯蓄目標', '教育・修繕・旅行の進み具合と月々の目安'],
  ['#/year', '年間ビュー', '12か月の支出・貯蓄と年間合計'],
  ['#/guide', '使い方ガイド', '月次チェックと計画の作り方'],
];

export const linkCards = () =>
  `<nav class="linkcards" aria-label="各ページへ">${sectionLinks.map(([h, t, d]) => `<a href="${h}"><strong>${t}</strong><span>${d}</span></a>`).join('')}</nav>`;
