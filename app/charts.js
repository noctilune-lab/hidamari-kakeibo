// Chart builders. They return HTML/SVG strings; bars are plain CSS boxes so the first load stays tiny.

import { yen, monthShort, esc } from './format.js';

// Horizontal bars: actual as the fill, planned as a vertical tick. Over plan turns ochre.
export function categoryBars(rows) {
  const max = Math.max(...rows.map((r) => Math.max(r.actual, r.planned)), 1);
  return `<ul class="cbars">${rows.map((r) => {
    const over = r.actual > r.planned;
    return `<li><span class="cb-name">${esc(r.name)}</span>
      <span class="cb-track" role="img" aria-label="${esc(r.name)} 実績${yen(r.actual)} 予算${yen(r.planned)}">
        <i class="cb-fill${over ? ' over' : ''}" style="width:${(r.actual / max) * 100}%"></i>
        <b class="cb-plan" style="left:${(r.planned / max) * 100}%"></b></span>
      <span class="cb-val">${yen(r.actual)}</span></li>`;
  }).join('')}</ul>`;
}

// One stacked bar splitting the take-home pay into spending and saving.
export function splitBar(spending, saving, takeHome) {
  const s = (spending / takeHome) * 100;
  return `<div class="split" role="img" aria-label="手取りの内訳 支出${yen(spending)} 貯蓄${yen(saving)}">
    <span class="sp-spend" style="width:${s}%">支出 ${yen(spending)}</span>
    <span class="sp-save" style="width:${100 - s}%">貯蓄 ${yen(saving)}</span></div>`;
}

// Grouped columns for a list of {label, a, b, real}; SVG, so it scales to any width.
export function columns(items, { max, aName, bName, line }) {
  const W = 640, H = 220, padL = 44, padB = 26, padT = 12;
  const plotH = H - padB - padT;
  const slot = (W - padL) / items.length;
  const bw = Math.min(26, slot / 2 - 3);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  let svg = `<svg class="cols" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aName)}と${esc(bName)}の月別グラフ">`;
  for (const t of ticks) {
    svg += `<line x1="${padL}" x2="${W}" y1="${y(t)}" y2="${y(t)}" class="grid"/><text x="${padL - 6}" y="${y(t) + 4}" class="ax" text-anchor="end">${Math.round(t / 10000)}万</text>`;
  }
  items.forEach((it, i) => {
    const cx = padL + slot * i + slot / 2;
    svg += `<rect x="${cx - bw - 1}" y="${y(it.a)}" width="${bw}" height="${plotH + padT - y(it.a)}" class="colA${it.real ? '' : ' plan'}"><title>${esc(it.label)} ${esc(aName)} ${yen(it.a)}</title></rect>`;
    svg += `<rect x="${cx + 1}" y="${y(it.b)}" width="${bw}" height="${plotH + padT - y(it.b)}" class="colB${it.real ? '' : ' plan'}"><title>${esc(it.label)} ${esc(bName)} ${yen(it.b)}</title></rect>`;
    svg += `<text x="${cx}" y="${H - 8}" class="ax" text-anchor="middle">${esc(it.label)}</text>`;
  });
  if (line) svg += `<line x1="${padL}" x2="${W}" y1="${y(line.value)}" y2="${y(line.value)}" class="refline"/><text x="${W - 2}" y="${y(line.value) - 4}" class="ax ref" text-anchor="end">${esc(line.label)}</text>`;
  return svg + '</svg>';
}

// Three-month trend for the overview: spending against the plan, saving beside it.
export function trendColumns(summaries, plannedTotal) {
  return columns(
    summaries.map((s) => ({ label: monthShort(s.month), a: s.spending, b: s.saving, real: true })),
    { max: 400000, aName: '支出', bName: '貯蓄', line: { value: plannedTotal, label: `予算 ${yen(plannedTotal)}` } },
  );
}

export function progress(ratio, label) {
  const p = Math.max(0, Math.min(1, ratio)) * 100;
  return `<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.toFixed(1)}" aria-label="${esc(label)}"><i style="width:${p}%"></i></div>`;
}
