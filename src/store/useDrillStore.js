import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Generate hole grid from row/column configuration.
 * Rows = letters (A, B, C, ...), Columns = numbers (1, 2, 3, ...).
 */
const generateHoles = (rows, cols) => {
  const holes = {};
  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r); // A, B, C, ...
    const isEvenRow = r % 2 !== 0; // index 1 is Row B (even row)
    const rowCols = isEvenRow ? Math.max(1, cols - 1) : cols;

    for (let c = 1; c <= rowCols; c++) {
      const id = `${rowLabel}${c}`;
      holes[id] = {
        id,
        row: rowLabel,
        col: c,
        depth: null,
        notes: '',
        status: 'empty', // empty | completed | pending | error
        updatedAt: null,
        updatedBy: null,
      };
    }
  }
  return holes;
};

const useDrillStore = create(
  persist(
    (set, get) => ({
      // Blasting area config
      areas: [],
      activeAreaId: null,

      // UI state
      selectedHoleId: null,
      searchQuery: '',
      statusFilter: 'all', // all | empty | completed | pending | error
      sidebarOpen: false,

      // ------- Actions -------

      /** Create a new blasting area */
      createArea: ({ name, rows, cols, location, date, groupLeader, crew, shift, burden, spasi, diameter }) => {
        const id = `area-${Date.now()}`;
        const holes = generateHoles(rows, cols);
        const area = {
          id,
          name,
          rows,
          cols,
          location: location || '',
          date: date || new Date().toISOString().split('T')[0],
          groupLeader: groupLeader || '',
          crew: crew || '',
          shift: shift || 'shift1',
          burden: burden || null,
          spasi: spasi || null,
          diameter: diameter || null,
          holes,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          areas: [...state.areas, area],
          activeAreaId: id,
          selectedHoleId: null,
          searchQuery: '',
          statusFilter: 'all',
        }));
        return id;
      },

      /** Set active blasting area */
      setActiveArea: (areaId) =>
        set({
          activeAreaId: areaId,
          selectedHoleId: null,
          searchQuery: '',
          statusFilter: 'all',
        }),

      /** Delete a blasting area */
      deleteArea: (areaId) =>
        set((state) => ({
          areas: state.areas.filter((a) => a.id !== areaId),
          activeAreaId: state.activeAreaId === areaId ? null : state.activeAreaId,
        })),

      /** Edit blasting area metadata */
      updateArea: (areaId, updates) =>
        set((state) => ({
          areas: state.areas.map((a) =>
            a.id === areaId ? { ...a, ...updates } : a
          ),
        })),

      /** Select a hole */
      selectHole: (holeId) => set({ selectedHoleId: holeId }),

      /** Save depth measurement for a hole */
      saveHoleMeasurement: (holeId, { depth, notes }) =>
        set((state) => {
          const area = state.areas.find((a) => a.id === state.activeAreaId);
          if (!area) return {};

          const hole = area.holes[holeId];
          if (!hole) return {};

          const hasError = depth === null || depth === undefined || depth === '';
          const updatedHole = {
            ...hole,
            depth: depth !== null && depth !== undefined && depth !== '' ? Number(depth) : null,
            notes: notes || '',
            status: hasError ? 'error' : 'completed',
            updatedAt: new Date().toISOString(),
            updatedBy: 'Operator',
          };
          console.log('updatedHole', updatedHole);
          const updatedHoles = { ...area.holes, [holeId]: updatedHole };
          const newAreas = state.areas.map((a) =>
            a.id === state.activeAreaId ? { ...a, holes: updatedHoles } : a
          );
          console.log('newAreas', newAreas);
          return {
            areas: newAreas,
            selectedHoleId: null,
          };
        }),

      /** Mark a hole as pending sync */
      markHolePending: (holeId) =>
        set((state) => {
          const area = state.areas.find((a) => a.id === state.activeAreaId);
          if (!area || !area.holes[holeId]) return {};

          const updatedHoles = {
            ...area.holes,
            [holeId]: { ...area.holes[holeId], status: 'pending' },
          };
          return {
            areas: state.areas.map((a) =>
              a.id === state.activeAreaId ? { ...a, holes: updatedHoles } : a
            ),
          };
        }),

      /** Reset a hole to empty */
      resetHole: (holeId) =>
        set((state) => {
          const area = state.areas.find((a) => a.id === state.activeAreaId);
          if (!area || !area.holes[holeId]) return {};

          const updatedHoles = {
            ...area.holes,
            [holeId]: {
              ...area.holes[holeId],
              depth: null,
              notes: '',
              status: 'empty',
              updatedAt: null,
              updatedBy: null,
            },
          };
          return {
            areas: state.areas.map((a) =>
              a.id === state.activeAreaId ? { ...a, holes: updatedHoles } : a
            ),
          };
        }),

      /** Bulk reset all holes in the active area */
      resetAllHoles: () =>
        set((state) => {
          const area = state.areas.find((a) => a.id === state.activeAreaId);
          if (!area) return {};

          const resetHoles = {};
          Object.keys(area.holes).forEach((id) => {
            resetHoles[id] = {
              ...area.holes[id],
              depth: null,
              notes: '',
              status: 'empty',
              updatedAt: null,
              updatedBy: null,
            };
          });
          return {
            areas: state.areas.map((a) =>
              a.id === state.activeAreaId ? { ...a, holes: resetHoles } : a
            ),
          };
        }),

      // UI
      setSearchQuery: (q) => set({ searchQuery: q }),
      setStatusFilter: (f) => set({ statusFilter: f }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Selectors moved to src/hooks/useDrillSelectors.js for proper reactivity
    }),
    {
      name: 'drillops-storage',
      version: 1,
    }
  )
);

export default useDrillStore;
