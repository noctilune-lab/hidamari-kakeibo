// Display helpers: yen, percent, month names and HTML escaping.

export const yen = (n) => (n < 0 ? '−' : '') + '¥' + Math.abs(Math.round(n)).toLocaleString('en-US');

export const signedYen = (n) => (n > 0 ? '+' : n < 0 ? '−' : '±') + '¥' + Math.abs(Math.round(n)).toLocaleString('en-US');

export const pct = (part, whole, digits = 1) => (whole ? ((part / whole) * 100).toFixed(digits) : '0.0') + '%';

export const monthLabel = (m) => `${m.slice(0, 4)}年${Number(m.slice(5))}月`;

export const monthShort = (m) => `${Number(m.slice(5))}月`;

export const dateLabel = (d) => `${Number(d.slice(5, 7))}/${Number(d.slice(8))}`;

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
