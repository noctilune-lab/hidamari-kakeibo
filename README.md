# hidamari-kakeibo

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/noctilune-lab/hidamari-kakeibo/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/noctilune-lab/hidamari-kakeibo/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

ひだまり家計帳 — a household budget site for a sample household (a couple with one child, ¥520,000 monthly take-home pay): planned vs actual spending by category, an expense log, savings goals and a yearly view. Every figure is computed from the sample data, so adding or deleting an expense updates every total. Static files under `app/`, no network requests, works offline on desktop and phone.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the overview, budget, expenses, goals, year and guide pages are hash routes (`#/budget`, …). The month switcher (September / October / November) drives the overview, budget table and expense log; the expense log filters, sorts, adds and deletes entries; the goals page edits monthly saving and projects the finish month.

Node 22 or later, standard library only. `main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendor library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ec83f8e6&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
