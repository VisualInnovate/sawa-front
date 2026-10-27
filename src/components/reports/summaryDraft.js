let nextPoint = 0;

// `number`: the question's number in its domain (M-3); none for a point written by hand.
export const newSummaryPoint = (text = "", number = null) => ({ id: `point-${Date.now()}-${nextPoint++}`, text, number });

/** Editable plan tables from the newest chosen evaluation, grouped by level and symbol. */
export function createSummaryTables(test) {
  const names = new Map((test?.result?.levels ?? []).map(level => [String(level.level_id), level.level_name]));
  const levels = new Map();
  for (const goal of test?.result?.summary ?? []) {
    const key = String(goal.level_id ?? "");
    if (!levels.has(key)) levels.set(key, new Map());
    const rows = levels.get(key);
    const symbol = goal.symbol || goal.general_goal || "";
    if (!rows.has(symbol)) rows.set(symbol, { symbol: goal.symbol ?? "", strengths: [], weaknesses: [] });
    const row = rows.get(symbol);
    for (const [kind, source] of [["strengths", "strength"], ["weaknesses", "weak"]]) {
      row[kind].push(...(goal[source] ?? []).filter(point => point.question).map(point => newSummaryPoint(point.question, point.number ?? null)));
    }
  }
  return [...levels.entries()].sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, rows]) => ({ key, title: names.get(key) ?? "", rows: [...rows.values()] }));
}

/** Preserve deliberate deletions, including an empty points array, when reopening a draft. */
export function restoreSummaryTables(base, saved) {
  if (!Array.isArray(saved)) return base;
  return base.map(table => {
    const stored = saved.find(item => item?.key === table.key);
    if (!Array.isArray(stored?.rows)) return table;
    return { ...table, rows: stored.rows.filter(row => row && typeof row.symbol === "string").map(row => ({
      symbol: row.symbol,
      strengths: (Array.isArray(row.strengths) ? row.strengths : []).filter(point => typeof point?.text === "string").map(point => newSummaryPoint(point.text, point.number ?? null)),
      weaknesses: (Array.isArray(row.weaknesses) ? row.weaknesses : []).filter(point => typeof point?.text === "string").map(point => newSummaryPoint(point.text, point.number ?? null)),
    })) };
  });
}
