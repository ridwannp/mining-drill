import { useMemo, useState, useRef, useEffect } from 'react';
import HoleCard from './HoleCard';
import { useActiveArea, useFilteredHoles } from '../hooks/useDrillSelectors';
import useDrillStore from '../store/useDrillStore';

/**
 * Grid of drill hole cards — organizes by row for natural visual grouping.
 */
const HoleGrid = () => {
  const area = useActiveArea();
  const filteredHoles = useFilteredHoles();
  const updateArea = useDrillStore((s) => s.updateArea);

  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

  const handleContainerClick = (e) => {
    if (!isDrawing) return;
    
    // Calculate percentage relative to container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const currentPoints = area.boundaryPoints || [];
    updateArea(area.id, { boundaryPoints: [...currentPoints, { x, y }] });
  };

  const handleClearBoundary = () => {
    updateArea(area.id, { boundaryPoints: [] });
  };

  // Calculate pixel coordinates for the SVG polygon
  const polyPoints = (area.boundaryPoints || [])
    .map(p => `${(p.x / 100) * containerSize.width},${(p.y / 100) * containerSize.height}`)
    .join(' ');

  const northAngle = area.northAngle || 0;
  const compassPos = area.compassPos || { x: 16, y: 16 };
  const compassDrag = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0, moved: false });

  const handleCompassPointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    compassDrag.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: compassPos.x,
      origY: compassPos.y,
      moved: false,
    };
  };

  const handleCompassPointerMove = (e) => {
    if (!compassDrag.current.dragging) return;
    const dx = e.clientX - compassDrag.current.startX;
    const dy = e.clientY - compassDrag.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) compassDrag.current.moved = true;
    updateArea(area.id, {
      compassPos: {
        x: compassDrag.current.origX + dx,
        y: compassDrag.current.origY + dy,
      },
    });
  };

  const handleCompassPointerUp = (e) => {
    e.stopPropagation();
    if (!compassDrag.current.moved) {
      // It was a click, not a drag — rotate
      updateArea(area.id, { northAngle: (northAngle + 45) % 360 });
    }
    compassDrag.current.dragging = false;
  };

  return (
    <div className="animate-fade-in flex flex-col gap-4 relative">
      {/* Compass Widget — draggable & click-to-rotate */}
      <div
        className="absolute z-30 flex flex-col items-center group select-none"
        style={{
          left: compassPos.x,
          top: compassPos.y,
          cursor: compassDrag.current.dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onPointerDown={handleCompassPointerDown}
        onPointerMove={handleCompassPointerMove}
        onPointerUp={handleCompassPointerUp}
        title="Drag to move · Click to rotate"
      >
        <div
          className="w-16 h-16 rounded-full border-2 border-slate-600 bg-slate-800/90 backdrop-blur-md flex items-center justify-center relative shadow-xl transition-transform duration-300"
          style={{ transform: `rotate(${northAngle}deg)` }}
        >
          {/* Cardinal labels */}
          <div className="absolute top-1 text-[11px] font-extrabold text-red-500 leading-none">N</div>
          <div className="absolute bottom-1 text-[11px] font-bold text-slate-400 leading-none">S</div>
          <div className="absolute left-1.5 text-[10px] font-bold text-slate-500 leading-none">W</div>
          <div className="absolute right-1.5 text-[10px] font-bold text-slate-500 leading-none">E</div>
          {/* Needle */}
          <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 via-red-500/40 to-slate-400 rounded-full"></div>
          {/* Center dot */}
          <div className="absolute w-2 h-2 rounded-full bg-slate-300 shadow-inner"></div>
        </div>
        <span className="text-[9px] text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Drag / Click
        </span>
      </div>

      {/* Controls for boundary */}
      <div className="flex justify-end gap-2 px-2">
        {area.boundaryPoints?.length > 0 && (
          <button 
            onClick={handleClearBoundary}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Clear Boundary
          </button>
        )}
        <button 
          onClick={() => setIsDrawing(!isDrawing)}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${isDrawing ? 'bg-amber-500 text-slate-900 shadow-amber-500/20' : 'bg-slate-800 text-amber-500 hover:bg-slate-700'}`}
        >
          {isDrawing ? 'Finish Drawing' : 'Draw Boundary'}
        </button>
      </div>

      <div 
        ref={containerRef}
        className={`relative rounded-xl border border-transparent transition-colors ${isDrawing ? 'border-amber-500/50 bg-slate-900/30 cursor-crosshair' : ''}`}
        onClick={handleContainerClick}
      >
        {/* SVG overlay for boundary points */}
        {(area.boundaryPoints?.length > 0 || isDrawing) && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
            {area.boundaryPoints && area.boundaryPoints.length > 0 && containerSize.width > 0 && (
              <polygon
                points={polyPoints}
                fill="rgba(245, 158, 11, 0.1)"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}
            {area.boundaryPoints?.map((p, i) => (
              <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="4" fill="#f59e0b" />
            ))}
          </svg>
        )}

        <div className="p-2 sm:p-4">
          {rows.map(([rowLabel, holes]) => {
            const isIndent = rowLabel.charCodeAt(0) % 2 === 0;
            return (
              <div key={rowLabel} className="mb-3 relative">
                {/* Row label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-6 text-center flex-shrink-0">
                    {rowLabel}
                  </span>
                  <div className="h-px flex-1 bg-slate-800"></div>
                </div>

                {/* Holes in this row */}
                <div
                  className={`grid gap-2 hole-grid-cols ${isIndent ? 'ml-8 sm:ml-12' : ''}`}
                >
                  {holes.map((hole) => (
                    <HoleCard key={hole.id} hole={hole} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HoleGrid;
