import { useMemo } from 'react';
import HoleCard from './HoleCard';
import { useActiveArea, useFilteredHoles } from '../hooks/useDrillSelectors';

/**
 * Grid of drill hole cards — organizes by row for natural visual grouping.
 */
const HoleGrid = () => {
  const area = useActiveArea();
  const filteredHoles = useFilteredHoles();

  // Group by row for row labels
  const rows = useMemo(() => {
    if (!area) return [];
    const rowMap = new Map();
    filteredHoles.forEach((hole) => {
      if (!rowMap.has(hole.row)) {
        rowMap.set(hole.row, []);
      }
      rowMap.get(hole.row).push(hole);
    });
    return Array.from(rowMap.entries());
  }, [area, filteredHoles]);

  if (!area) return null;

  if (filteredHoles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-slate-500">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No holes found</p>
        <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {rows.map(([rowLabel, holes]) => (
        <div key={rowLabel} className="mb-3">
          {/* Row label */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-6 text-center flex-shrink-0">
              {rowLabel}
            </span>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          {/* Holes in this row */}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(80px, 1fr))`,
            }}
          >
            {holes.map((hole) => (
              <HoleCard key={hole.id} hole={hole} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HoleGrid;
