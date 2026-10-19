// The ABLLS pages serve two evaluations on the same tables: ABLLS Academy (four fixed domain types) and Ablls OT
// (domain types the staff add and delete; every type keeps the long-term goal + sub goals inputs). A route's
// `meta.assessment` picks one; each has its own API prefix, permissions, route names and evaluation type.
import { computed, ref } from 'vue'
import axios from 'axios'
import { ABLLS_TYPES, typeIcon, typeOf, typeOrder } from './abllsTypes'

export const ASSESSMENTS = {
  ablls: {
    key: 'ablls',
    api: 'able',
    perm: 'able',
    evaluationType: 4,
    title: 'ablls',
    customTypes: false,
    routes: {
      categories: 'ablls',
      missions: 'missions',
      create: 'mission-create',
      update: 'mission-update',
      test: 'mission-test',
      result: 'ablls-resulte',
    },
  },
  skills: {
    key: 'skills',
    api: 'skills',
    perm: 'skills',
    evaluationType: 7,
    title: 'ablls_skills',
    customTypes: true,
    routes: {
      categories: 'ablls-skills',
      missions: 'skills-missions',
      create: 'skills-mission-create',
      update: 'skills-mission-update',
      test: 'skills-test',
      result: 'skills-result',
    },
  },
}

export const assessmentOf = (route) => ASSESSMENTS[route?.meta?.assessment] || ASSESSMENTS.ablls

/** "able category list" / "skills category list" */
export const permOf = (assessment, resource, action) => `${assessment.perm} ${resource} ${action}`

/** "/api/able-category" / "/api/skills-category" */
export const apiOf = (assessment, resource) => `/api/${assessment.api}-${resource}`

/** The `type` an Ablls OT domain always has: long-term goal + sub goals. */
export const CUSTOM_TYPE = 'custom'

/**
 * The domain types of an evaluation as { value, id, label, icon, count }. ABLLS has its four fixed types (value =
 * the category's `type`); Ablls OT loads its types (value = "t<id>", the category's `type_id`).
 */
export function useDomainTypes(assessment, t) {
  const loaded = ref([])

  const types = computed(() =>
    assessment.customTypes
      ? loaded.value
      : ABLLS_TYPES.map((type) => ({ value: type.value, label: t(`ablls_ui.types.${type.value}`), icon: type.icon }))
  )

  const load = async () => {
    if (!assessment.customTypes) return
    const res = await axios.get(apiOf(assessment, 'type'))
    loaded.value = (res.data.data || []).map((type) => ({
      value: `t${type.id}`,
      id: type.id,
      label: type.title,
      icon: 'pi pi-tag',
      count: type.categories_count ?? 0,
    }))
  }

  const keyOf = (category) => (assessment.customTypes ? (category?.type_id ? `t${category.type_id}` : '') : typeOf(category))
  const find = (key) => types.value.find((type) => type.value === key)
  const labelOf = (key) => find(key)?.label || (assessment.customTypes ? '—' : t(`ablls_ui.types.${key}`))
  const iconOf = (key) => (assessment.customTypes ? 'pi pi-tag' : typeIcon(key))
  const orderOf = (key) => {
    if (!assessment.customTypes) return typeOrder(key)
    const i = types.value.findIndex((type) => type.value === key)
    return i < 0 ? types.value.length : i
  }
  const hintOf = (key) => t(`ablls_ui.types_hint.${assessment.customTypes ? CUSTOM_TYPE : key || 'academic'}`)

  return { types, load, keyOf, labelOf, iconOf, orderOf, hintOf }
}
