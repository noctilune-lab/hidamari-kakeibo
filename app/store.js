// The only mutable state: the entry list, the chosen month, expense-log view options and goal contributions.
// Kept in localStorage on this device only (a reset button restores the sample). No network.

import { seedEntries, CURRENT_MONTH } from './data.js';

const KEY = 'hidamari-kakeibo-v1';
const listeners = new Set();

const fresh = () => ({ entries: seedEntries(), month: CURRENT_MONTH, filter: 'all', sort: 'date-desc', contrib: {}, nextId: 1 });

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.entries)) return { ...fresh(), ...saved };
  } catch (e) { /* storage unavailable or corrupt: start from the sample */ }
  return fresh();
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode: keep in memory */ }
}

export const get = () => state;

export function set(patch) {
  state = { ...state, ...patch };
  save();
  listeners.forEach((fn) => fn());
}

export const subscribe = (fn) => listeners.add(fn);

export function addEntry({ date, category, note, amount }) {
  const id = 'u' + state.nextId;
  set({ entries: [...state.entries, { id, date, category, note, amount }], nextId: state.nextId + 1 });
}

export const deleteEntry = (id) => set({ entries: state.entries.filter((e) => e.id !== id) });

export function reset() {
  state = fresh();
  save();
  listeners.forEach((fn) => fn());
}
