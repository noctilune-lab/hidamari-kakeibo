// #/guide — practical guidance, how the sample plan is built, and the method note.

import { HOUSEHOLD, CATEGORIES } from '../data.js';
import { plannedTotal, plannedSaving } from '../calc.js';
import { yen, pct, esc } from '../format.js';
import { pageHead } from '../ui.js';

export function render() {
  const fixed = ['housing', 'telecom', 'insurance', 'education'].map((id) => CATEGORIES.find((c) => c.id === id));
  const fixedSum = fixed.reduce((t, c) => t + c.planned, 0);
  const take = HOUSEHOLD.takeHome;
  const share = (id) => pct(CATEGORIES.find((c) => c.id === id).planned, take);

  return `${pageHead('使い方ガイド', '家計簿を続けるためのコツと、このサイトの数字のつくりをまとめました。')}
  <div class="grid2">
    <section class="card prose">
      <h2>このサイトの使い方</h2>
      <ol>
        <li>右上の <b>9月・10月・11月</b> で見る月を切り替えます。<a href="#/">概要</a>・<a href="#/budget">予算</a>・<a href="#/expenses">支出</a>が同じ月に切り替わります。</li>
        <li><a href="#/expenses">支出</a>で使った日・費目・メモ・金額を追加します。間違えた行は「削除」で消せます。</li>
        <li><a href="#/budget">予算</a>で、費目ごとの予算と実績の差を見て、超過した費目を確認します。</li>
        <li><a href="#/goals">目標</a>で、期限までに毎月いくら積み立てるかを確認し、積立額を試します。</li>
        <li><a href="#/year">年間</a>で、12か月の貯蓄と貯蓄率の見通しを確認します。</li>
      </ol>
    </section>
    <section class="card prose">
      <h2>毎月のチェックリスト</h2>
      <ul class="checks">
        <li>月末までに、レシートや引き落としを「支出の記録」に入れ切る</li>
        <li>実績合計が予算を超えた月は、超過の大きい費目を2つまで選んで原因を一言メモする</li>
        <li>貯蓄は「残ったら」ではなく、給与が入った日に先に分けておく</li>
        <li>目標ごとの積立額を確認し、貯蓄額から目標へ回す分を決める</li>
        <li>保険・通信・サブスクなど毎月かかる固定費は、年に1回は内容を見直す</li>
      </ul>
    </section>
    <section class="card prose">
      <h2>サンプル計画のつくり方</h2>
      <p>手取り ${yen(take)} を起点に、12費目の予算を合計 ${yen(plannedTotal())} に決め、残りの <b class="num">${yen(plannedSaving())}</b>（${pct(plannedSaving(), take)}）を計画貯蓄としています。</p>
      <ul>
        <li>住居費 ${yen(CATEGORIES[0].planned)} は手取りの ${share('housing')}</li>
        <li>食費 ${yen(CATEGORIES[1].planned)} は手取りの ${share('food')}</li>
        <li>毎月ほぼ同額の固定的な費目（${fixed.map((c) => esc(c.name)).join('・')}）の合計は ${yen(fixedSum)}（手取りの ${pct(fixedSum, take)}）</li>
      </ul>
      <p>これらの割合はこのサンプル計画の中での目安であり、公的な統計や一般的な平均ではありません。自分の家計では、手取りと固定費を入れ替えて考えてください。</p>
    </section>
    <section class="card prose">
      <h2>予算を守るためのコツ</h2>
      <ul>
        <li><b>固定費から決める：</b>家賃・保険・通信など動かしにくい費目を先に確定し、残りで変動費を組みます。</li>
        <li><b>予備のある費目を持つ：</b>「その他」や「医療費」に少し余裕を置くと、予定外の出費で全体が崩れにくくなります。</li>
        <li><b>差額に注目する：</b>金額そのものより、予算との差額が毎月同じ方向に出ている費目を見つけて、予算か使い方を直します。</li>
        <li><b>目標には期限をつける：</b>期限があると月々の必要額が計算でき、貯蓄額とのバランスが取れます。</li>
      </ul>
    </section>
    <section class="card prose soft wide">
      <h2>方法メモ</h2>
      <ul>
        <li>${esc(HOUSEHOLD.label)}。すべての数字はこのサイトのサンプルデータから計算しています。</li>
        <li>実績は、支出の記録（明細）の合計です。合計や貯蓄率などは、表示のたびに明細から再計算します。</li>
        <li>年間ビューは 2026年9月〜2027年8月。実績の3か月以外は、予算どおりに支出した計画値です。</li>
        <li>通信は行わず、ブラウザだけで動きます。追加・削除した内容はこの端末のブラウザ内にだけ保存され、ページ下部の「サンプルの状態に戻す」で元に戻せます。</li>
      </ul>
    </section>
  </div>`;
}
