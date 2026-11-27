// The sample household and every figure the site shows. Nothing here is a total: totals are computed in calc.js.

export const HOUSEHOLD = {
  title: 'ひだまり家計帳',
  label: 'モデル家計：夫婦＋子1人の3人世帯のサンプル',
  takeHome: 520000,
};

// Planned monthly spending, identical every month.
export const CATEGORIES = [
  { id: 'housing', name: '住居費', planned: 110000 },
  { id: 'food', name: '食費', planned: 72000 },
  { id: 'utilities', name: '水道光熱費', planned: 24000 },
  { id: 'telecom', name: '通信費', planned: 16000 },
  { id: 'transport', name: '交通費', planned: 18000 },
  { id: 'education', name: '教育費', planned: 30000 },
  { id: 'insurance', name: '保険', planned: 22000 },
  { id: 'daily', name: '日用品', planned: 12000 },
  { id: 'leisure', name: '娯楽・交際費', planned: 25000 },
  { id: 'medical', name: '医療費', planned: 8000 },
  { id: 'clothing', name: '被服費', planned: 10000 },
  { id: 'other', name: 'その他', planned: 13000 },
];

// Months with real entries, and the twelve-month window of the yearly view.
export const MONTHS = ['2026-09', '2026-10', '2026-11'];
export const YEAR_MONTHS = [
  '2026-09', '2026-10', '2026-11', '2026-12', '2027-01', '2027-02',
  '2027-03', '2027-04', '2027-05', '2027-06', '2027-07', '2027-08',
];
export const CURRENT_MONTH = '2026-11';

// Savings goals. Saving for them starts the month after CURRENT_MONTH and ends in the deadline month.
export const GOALS = [
  { id: 'education', name: '教育資金', target: 1000000, saved: 640000, deadline: '2028-03', memo: '高校・大学の入学時にまとめて必要になる費用の備え' },
  { id: 'repair', name: '住宅修繕', target: 500000, saved: 210000, deadline: '2027-11', memo: '外壁・水回りなど、数年おきに来る修繕の積立' },
  { id: 'travel', name: '旅行', target: 200000, saved: 85000, deadline: '2027-07', memo: '家族旅行を借入や生活費に頼らず行くための積立' },
];

// Every actual is the sum of these entries: [day, category id, note, amount].
const LEDGER = {
  '2026-09': [
    ['01', 'housing', '家賃', 98000], ['01', 'housing', '管理費・駐車場', 12000],
    ['05', 'food', 'スーパーまとめ買い', 21400], ['12', 'food', 'スーパー', 19800], ['19', 'food', 'スーパー', 17600], ['27', 'food', '家族で外食', 11400],
    ['10', 'utilities', '電気', 9800], ['12', 'utilities', 'ガス', 6500], ['15', 'utilities', '水道', 5000],
    ['05', 'telecom', '携帯3回線', 11200], ['05', 'telecom', '光回線', 4800],
    ['04', 'transport', '通勤定期', 8000], ['18', 'transport', 'ガソリン', 4900], ['25', 'transport', '電車・バス', 2200],
    ['08', 'education', '習い事の月謝', 22000], ['16', 'education', '教材費', 8000],
    ['20', 'insurance', '生命保険', 14000], ['20', 'insurance', '医療・火災保険', 8000],
    ['07', 'daily', 'ドラッグストア', 6100], ['21', 'daily', '雑貨・消耗品', 4800],
    ['13', 'leisure', '週末のお出かけ', 12400], ['22', 'leisure', '友人との食事会', 12200],
    ['10', 'medical', '内科', 4300], ['24', 'medical', '歯科', 5500],
    ['14', 'clothing', '秋物の衣類', 11900],
    ['18', 'other', '贈答品', 8500], ['26', 'other', '雑費', 5000],
  ],
  '2026-10': [
    ['01', 'housing', '家賃', 98000], ['01', 'housing', '管理費・駐車場', 12000],
    ['03', 'food', 'スーパーまとめ買い', 20100], ['10', 'food', 'スーパー', 18400], ['17', 'food', 'スーパー', 17300], ['24', 'food', '家族で外食', 12200], ['31', 'food', 'ハロウィン食材', 9600],
    ['10', 'utilities', '電気', 10100], ['12', 'utilities', 'ガス', 7300], ['15', 'utilities', '水道', 5500],
    ['05', 'telecom', '携帯3回線', 11200], ['05', 'telecom', '光回線', 4800],
    ['04', 'transport', '通勤定期', 8000], ['13', 'transport', 'ガソリン', 5300], ['20', 'transport', '高速・駐車場', 6400], ['28', 'transport', '電車・バス', 1600],
    ['08', 'education', '習い事の月謝', 22000], ['12', 'education', '遠足費・学用品', 6500], ['25', 'education', '発表会の参加費', 7500],
    ['20', 'insurance', '生命保険', 14000], ['20', 'insurance', '医療・火災保険', 8000],
    ['06', 'daily', 'ドラッグストア', 5800], ['19', 'daily', '洗剤・消耗品', 7500],
    ['09', 'leisure', 'ハロウィンのイベント', 8700], ['18', 'leisure', '友人との食事会', 9800], ['26', 'leisure', '日帰りのお出かけ', 12700],
    ['14', 'medical', 'インフルエンザ予防接種', 6200],
    ['05', 'clothing', '子ども服', 9300], ['21', 'clothing', 'コート補修・小物', 5500],
    ['22', 'other', '雑費', 5700],
  ],
  '2026-11': [
    ['01', 'housing', '家賃', 98000], ['01', 'housing', '管理費・駐車場', 12000],
    ['02', 'food', 'スーパー', 9800], ['06', 'food', 'スーパーまとめ買い', 11200], ['09', 'food', '家族で外食', 7400], ['13', 'food', 'スーパー', 10600],
    ['16', 'food', '生協の宅配', 9300], ['20', 'food', 'スーパーまとめ買い', 12100], ['23', 'food', '外食', 6900], ['25', 'food', 'スーパー', 7000],
    ['10', 'utilities', '電気', 11400], ['12', 'utilities', 'ガス', 9200], ['15', 'utilities', '水道', 5200],
    ['05', 'telecom', '携帯3回線', 11200], ['05', 'telecom', '光回線', 4800],
    ['04', 'transport', '通勤定期', 8000], ['12', 'transport', 'ガソリン', 5200], ['19', 'transport', '電車・バス', 3200],
    ['08', 'education', '習い事の月謝', 22000], ['18', 'education', '教材・学用品', 9500],
    ['20', 'insurance', '生命保険', 14000], ['20', 'insurance', '医療・火災保険', 8000],
    ['07', 'daily', 'ドラッグストア', 5400], ['15', 'daily', '洗剤・消耗品', 4200], ['22', 'daily', '100円ショップ', 4000],
    ['08', 'leisure', '映画・お出かけ', 6500], ['14', 'leisure', '友人との食事会', 9800], ['22', 'leisure', '家族で遊園地', 11600],
    ['11', 'medical', '小児科', 2300], ['21', 'medical', '歯科', 3100],
    ['09', 'clothing', '子ども服', 7800], ['23', 'clothing', '靴下・肌着', 4500],
    ['16', 'other', 'ご祝儀', 10000], ['24', 'other', '郵送・手数料', 2300], ['25', 'other', '雑費', 5500],
  ],
};

export function seedEntries() {
  const list = [];
  let n = 0;
  for (const month of MONTHS) {
    for (const [day, category, note, amount] of LEDGER[month]) {
      n += 1;
      list.push({ id: 's' + n, date: `${month}-${day}`, category, note, amount });
    }
  }
  return list;
}
