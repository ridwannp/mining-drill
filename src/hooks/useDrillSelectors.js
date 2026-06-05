import { useMemo } from 'react';
import useDrillStore from '../store/useDrillStore';

/**
 * Reactive hook: returns the currently active blasting area.
 * Subscribes to `areas` and `activeAreaId` so it re-renders on changes.
 */
export const useActiveArea = () => {
  const areas = useDrillStore((s) => s.areas);
  const activeAreaId = useDrillStore((s) => s.activeAreaId);
  return useMemo(
    () => areas.find((a) => a.id === activeAreaId) || null,
    [areas, activeAreaId]
  );
};

/**
 * Reactive hook: returns filtered & sorted holes for the active area.
 * Subscribes to areas, activeAreaId, searchQuery, and statusFilter.
 */
export const useFilteredHoles = () => {
  const areas = useDrillStore((s) => s.areas);
  const activeAreaId = useDrillStore((s) => s.activeAreaId);
  const searchQuery = useDrillStore((s) => s.searchQuery);
  const statusFilter = useDrillStore((s) => s.statusFilter);
  const conditionFilter = useDrillStore((s) => s.conditionFilter);

  return useMemo(() => {
    const area = areas.find((a) => a.id === activeAreaId);
    if (!area) return [];

    let holes = Object.values(area.holes);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toUpperCase();
      holes = holes.filter((h) => h.id.includes(q));
    }

    // Status filter
    if (statusFilter !== 'all') {
      holes = holes.filter((h) => h.status === statusFilter);
    }
    
    // Condition filter
    if (conditionFilter !== 'all') {
      holes = holes.filter((h) => h.condition === conditionFilter);
    }

    // Sort: row first (A, B, C), then column (1, 2, 3)
    holes.sort((a, b) => {
      if (a.row !== b.row) return a.row.localeCompare(b.row);
      return a.col - b.col;
    });

    return holes;
  }, [areas, activeAreaId, searchQuery, statusFilter, conditionFilter]);
};

/**
 * Reactive hook: returns completion stats for the active area.
 * Subscribes to areas and activeAreaId.
 */
export const useStats = () => {
  const areas = useDrillStore((s) => s.areas);
  const activeAreaId = useDrillStore((s) => s.activeAreaId);

  return useMemo(() => {
    const area = areas.find((a) => a.id === activeAreaId);
    if (!area)
      return { total: 0, completed: 0, pending: 0, error: 0, empty: 0, percentage: 0 };

    const holes = Object.values(area.holes);
    const total = holes.length;
    const completed = holes.filter((h) => h.status === 'completed').length;
    const pending = holes.filter((h) => h.status === 'pending').length;
    const error = holes.filter((h) => h.status === 'error').length;
    const empty = holes.filter((h) => h.status === 'empty').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, error, empty, percentage };
  }, [areas, activeAreaId]);
};
