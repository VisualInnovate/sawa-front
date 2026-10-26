import { defineStore } from "pinia";
import axios from "axios";

/**
 * What the portal shows everywhere: the parent's children, what waits for them and the news. Read once from
 * `api/parent/home`, kept while the parent moves between pages, refreshed when the window comes back or after
 * something changed (a booking, an answer to a generalization).
 */
export const useParentPortalStore = defineStore("parentPortal", {
  state: () => ({
    home: null,
    loading: false,
    error: false,
    loadedAt: 0,
  }),
  getters: {
    children: (state) => state.home?.children ?? [],
    pending: (state) => state.home?.pending ?? {},
    unread: (state) => Number(state.home?.notifications?.unread ?? 0),
    waiting: (state) =>
      Number(state.home?.pending?.generalizations ?? 0) + Number(state.home?.pending?.consultations_waiting ?? 0),
    childById: (state) => (id) => (state.home?.children ?? []).find((child) => String(child.id) === String(id)) ?? null,
  },
  actions: {
    async load(force = false) {
      // Fresh enough for a page change; a page that changed something asks with force.
      if (!force && this.home && Date.now() - this.loadedAt < 60_000) return this.home;
      if (this.loading) return this.home;
      this.loading = true;
      this.error = false;
      try {
        const { data } = await axios.get("/api/parent/home");
        this.home = data;
        this.loadedAt = Date.now();
      } catch {
        this.error = !this.home;
      } finally {
        this.loading = false;
      }
      return this.home;
    },
    refresh() {
      return this.load(true);
    },
    reset() {
      this.home = null;
      this.loadedAt = 0;
      this.error = false;
    },
  },
});
