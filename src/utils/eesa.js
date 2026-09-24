// The Early Echoic Skills Assessment (EESA, VB-MAPP) exactly as printed, in English.
// Items are keyed by group and position read down each column ("g1_1" is "ah"); the server
// (app/Support/Milestone/Eesa.php) knows the same keys. In item text, ***x*** is bold italic,
// **x** bold and *x* italic, as on the form.

const columns = (group, cols) => cols.map((column, c) =>
  column.map((text, r) => ({ key: `g${group}_${c * column.length + r + 1}`, text })));

export const EESA_GROUPS = [
  {
    number: 1,
    title: "Group 1: Simple and reduplicated syllables",
    targets: "Targets: vowels, diphthongs, consonants p, b, m, n, h, w",
    halfPoint: true,
    columns: columns(1, [
      ["ah", "wow", "bee", "knee", "oo"],
      ["bye bye", "hop", "mama", "papa", "me"],
      ["one", "my", "boo", "no no", "oh"],
      ["moo", "up", "may", "pop", "too"],
      ["we", "boy", "wa wa", "toy", "baa"],
    ]),
  },
  {
    number: 2,
    title: "Group 2: 2-syllable combinations",
    targets: "Targets: Add consonants k, g, t, d, f, y, ng",
    halfPoint: true,
    columns: columns(2, [
      ["baby", "go eat", "nighttime", "bunny", "my foot", "yucky"],
      ["window", "funny", "meow", "kitty", "bow wow", "mommy"],
      ["open", "oh boy", "yumm-o", "potty", "pay day", "pokey"],
      ["taco", "foo-ey", "hankie", "too bad", "cookie", "puppy"],
      ["icky", "too hot", "monkey", "uh-oh", "daddy", "hot dog"],
    ]),
  },
  {
    number: 3,
    title: "Group 3: 3-syllable combinations",
    halfPoint: true,
    columns: columns(3, [
      ["tubby toy", "banana", "fee fi foe", "yummy food", "daddy up", "in a boat"],
      ["potato", "go bye bye", "fat doggy", "goofy goat", "hey me too", "my big toe"],
      ["do high five", "oh foo-ey", "binky boo", "one cookie", "open up", "peanut hat"],
      ["tiny pan", "peek a boo", "teddy bear", "doggy bone", "funny king", "a hiccup"],
      ["how many", "potty time", "giddy-up", "wet mitten", "teepee boat", "puppet game"],
    ]),
  },
  {
    number: 4,
    title: "Group 4: Prosody: spoken phrases",
    model: "(Model: Emphasize syllables in ***bold italics***)",
    scoring: [
      ["X", "= emphasis on correct syllables (1 point)"],
      ["/", "= emphasis on non-target syllables (½ point)"],
      ["Blank", "= monotone response (no emphasis) (0 points)"],
    ],
    halfPoint: true,
    columns: columns(4, [
      ["no ***WAY***", "bug-a-***BOO***"],
      ["***ONE*** bunny", "***UH***-oh"],
      ["in a ***MIN***-ute", "***MY*** mommy"],
      ["***TAKE*** it", "bow-***WOW***"],
      ["my ***MOM***-my", "***BUG***-a-boo"],
    ]),
  },
  {
    number: 5,
    title: "Group 5: Prosody: other contexts",
    scoring: [
      ["X", "= response correct or nearly so (1 point)"],
      ["Blank", "= response does not closely match model (0 points)"],
    ],
    halfPoint: false,
    // Written in lines under headings rather than columns.
    sections: [
      { heading: "Pitch", items: [
        { key: "g5_1", text: "Echoes pitch variations in 1-2 lines of a familiar song" },
        { key: "g5_2", text: "Echoes continuous warble (fire truck *OO-oo-OO-oo-OO*)" },
      ] },
      { heading: "Loudness", items: [
        { key: "g5_3", text: "Echoes whispering" },
        { key: "g5_4", text: "Echoes quiet/loud voice (*bye-bye* vs. **BYE-BYE**)" },
      ] },
      { heading: "Duration", items: [
        { key: "g5_5", text: "Sustains *ahh* for 3 seconds, echoically" },
      ] },
    ],
  },
];

export const EESA_SCORING_1_3 = [
  ["X", "= correct sounds and correct number of syllables (1 point)"],
  ["/", "= recognizable response, but incorrect or missing consonants or extra syllables (½ point)"],
  ["Blank", "= no response, incorrect vowels, or missing syllables (0 points)"],
];

/** Text with ***bold italic***, **bold** and *italic* runs, as [{ text, bold, italic }]. */
export function eesaRuns(text) {
  const runs = [];
  const pattern = /(\*{1,3})([^*]+)\1/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) runs.push({ text: text.slice(last, match.index) });
    const stars = match[1].length;
    runs.push({ text: match[2], bold: stars >= 2, italic: stars !== 2 });
    last = match.index + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last) });
  return runs;
}

/** What a box holds: 1, 0.5 (group 1-4 only) or blank. Returns a number, null for blank, or undefined when invalid. */
export function eesaValue(raw, halfPoint) {
  const text = String(raw ?? "").trim();
  if (text === "") return null;
  if (text === "1") return 1;
  if (halfPoint && ["0.5", ".5", "½"].includes(text)) return 0.5;
  return undefined;
}

/** { 1: sub-total, ..., 5: sub-total } and the total, from { key: raw box text }. */
export function eesaTotals(boxes) {
  const groups = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const group of EESA_GROUPS) {
    for (const key of eesaGroupKeys(group)) groups[group.number] += eesaValue(boxes[key], group.halfPoint) || 0;
  }
  return { groups, total: Object.values(groups).reduce((sum, value) => sum + value, 0) };
}

export const eesaGroupKeys = (group) => (group.columns
  ? group.columns.flat().map((item) => item.key)
  : group.sections.flatMap((section) => section.items.map((item) => item.key)));

/** Keys whose box holds something other than the group's allowed values. */
export function eesaInvalidKeys(boxes) {
  return EESA_GROUPS.flatMap((group) => eesaGroupKeys(group).filter((key) => eesaValue(boxes[key], group.halfPoint) === undefined));
}

/** The scores the server stores: { key: 1 | 0.5 } for filled boxes. */
export function eesaScores(boxes) {
  const scores = {};
  for (const group of EESA_GROUPS) {
    for (const key of eesaGroupKeys(group)) {
      const value = eesaValue(boxes[key], group.halfPoint);
      if (value) scores[key] = value;
    }
  }
  return scores;
}
