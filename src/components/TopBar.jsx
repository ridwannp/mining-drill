import useDrillStore from '../store/useDrillStore';
import { useActiveArea, useStats } from '../hooks/useDrillSelectors';

/**
 * Top navigation bar — hamburger (mobile), area title, and quick actions.
 */
const TopBar = ({ onExport }) => {
  const toggleSidebar = useDrillStore((s) => s.toggleSidebar);
  const area = useActiveArea();
  const stats = useStats();

  return (
    <header
      id="topbar"
      className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
    >
      {/* Hamburger — mobile only */}
      <button
        id="btn-menu-toggle"
        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        {area ? (
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-100 truncate leading-tight">
              {area.name}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{area.rows}×{area.cols} grid</span>
              <span className="text-slate-700">•</span>
              <span>{area.location || 'No location'}</span>
              <span className="text-slate-700">•</span>
              <span>{area.date}</span>
            </p>
          </div>
        ) : (
          <h2 className="text-base font-semibold text-slate-400">
            Select or create a blasting area
          </h2>
        )}
      </div>

      {/* Quick stats badge */}
      {area && (
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">
              {stats.completed}/{stats.total}
            </span>
          </div>
          <div className="text-sm font-bold text-amber-400">
            {stats.percentage}%
          </div>
        </div>
      )}

      {/* Export button */}
      {area && (
        <button
          id="btn-export"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer border border-slate-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="hidden sm:inline">Export</span>
        </button>
      )}
    </header>
  );
};

export default TopBar;
