// The four ABLLS Academy domain types. Academic preparation skills keep strengths/weaknesses, goals and
// questions; math, reading and spelling skills keep one long-term goal and sub goals. Every skill has a
// criterion: the scores (1, 2, 3 ...) it can be given.
export const ABLLS_TYPES = [
  { value: 'academic', icon: 'pi pi-book', example: 'C13' },
  { value: 'math', icon: 'pi pi-calculator', example: 'R' },
  { value: 'reading', icon: 'pi pi-eye', example: 'Q' },
  { value: 'spelling', icon: 'pi pi-pencil', example: 'T' },
]

export const CRITERIA_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const typeOf = (category) => category?.type || 'academic'
export const isAcademic = (category) => typeOf(category) === 'academic'
export const typeIcon = (type) => ABLLS_TYPES.find((t) => t.value === type)?.icon || 'pi pi-folder'
export const typeOrder = (type) => {
  const i = ABLLS_TYPES.findIndex((t) => t.value === type)
  return i < 0 ? ABLLS_TYPES.length : i
}

// C13 -> C13.1 for academic preparation, R -> R1 for the others; a domain whose missions are numbered
// "B-1" keeps that form (matches the backend's nextKey).
export const nextSkillKey = (category, keys = []) => {
  if (!category?.symbol) return ''
  const symbol = category.symbol.trim()
  const esc = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  let sep = isAcademic(category) ? '.' : ''
  if (keys.some((k) => new RegExp(`^${esc}-\\d+$`).test(k))) sep = '-'
  const max = Math.max(0, ...keys.map((k) => Number(String(k).trim().match(new RegExp(`^${esc}[.\\-]?(\\d+)$`))?.[1] ?? 0)))
  return `${symbol}${sep}${max + 1}`
}

// Scores an evaluator can give: 0 (not achieved) and the skill's criterion. Older missions without a
// criterion use one score per benchmark.
export const scoreOptions = (mission) => {
  const criteria = (mission?.criteria || []).map(Number).filter((n) => n > 0)
  const list = criteria.length ? criteria : Array.from({ length: mission?.benchmarks?.length || 1 }, (_, i) => i + 1)
  return [0, ...[...new Set(list)].sort((a, b) => a - b)]
}

// Older missions keep their single goal / question in place of the lists.
export const listOf = (mission, field, legacy) => {
  const list = (mission?.[field] || []).filter((s) => String(s || '').trim())
  if (list.length) return list
  return legacy && mission?.[legacy] ? [mission[legacy]] : []
}

// A goal / question list as the child reads it: the girl's wording for a girl ('1' is a girl) when the skill has
// one, else the boy's, with the child's first name in place of {{name}}.
const withName = (text, child) => String(text).replace(/\{\{.*?\}\}/g, String(child?.name ?? '').trim().split(/\s+/)[0] || '')

export const childListOf = (mission, field, legacy, child = {}) => {
  const female = String(child?.gender) === '1' ? listOf(mission, `${field}_female`) : []
  const list = female.length ? female : listOf(mission, field, legacy)
  return list.map((text) => withName(text, child))
}

// One text (the long-term goal) as the child reads it, the same way.
export const childTextOf = (mission, field, child = {}) => {
  const female = String(child?.gender) === '1' ? String(mission?.[`${field}_female`] || '').trim() : ''
  return withName(female || mission?.[field] || '', child)
}
