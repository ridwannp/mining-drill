import { useMemo } from 'react';
import useDrillStore from '../store/useDrillStore';
import { useConfirmModal } from '../hooks/useConfirmModal';

/**
 * Sidebar navigation — shows blasting areas list, create button, branding.
 */
const Sidebar = ({ onCreateArea }) => {
  const areas = useDrillStore((s) => s.areas);
  const activeAreaId = useDrillStore((s) => s.activeAreaId);
  const setActiveArea = useDrillStore((s) => s.setActiveArea);
  const deleteArea = useDrillStore((s) => s.deleteArea);
  const sidebarOpen = useDrillStore((s) => s.sidebarOpen);
  const setSidebarOpen = useDrillStore((s) => s.setSidebarOpen);
  const { confirm } = useConfirmModal();

  const sortedAreas = useMemo(
    () => [...areas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [areas]
  );

  const handleSelectArea = (id) => {
    setActiveArea(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <line x1="12" y1="12" x2="12" y2="22" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 leading-tight tracking-tight">
                DrillOps
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight">
                Drill Hole Management
              </p>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="px-4 py-4">
          <button
            id="btn-create-area"
            onClick={onCreateArea}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white font-semibold text-sm hover:from-amber-500 hover:to-amber-400 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Blasting Area
          </button>
        </div>

        {/* Areas List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
            Blasting Areas
          </p>
          {sortedAreas.length === 0 && (
            <p className="text-xs text-slate-600 px-2 py-6 text-center">
              No areas created yet.<br />Click the button above to start.
            </p>
          )}
          <div className="flex flex-col gap-1">
            {sortedAreas.map((area) => {
              const isActive = area.id === activeAreaId;
              const holesArr = Object.values(area.holes);
              const completed = holesArr.filter((h) => h.status === 'completed').length;
              const total = holesArr.length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={area.id}
                  id={`sidebar-area-${area.id}`}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800 border border-amber-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                  onClick={() => handleSelectArea(area.id)}
                >
                  {/* Progress indicator circle */}
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(71,85,105,0.4)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={pct === 100 ? '#10b981' : '#f59e0b'}
                        strokeWidth="3"
                        strokeDasharray={`${pct}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-300">
                      {pct}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                      {area.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {area.rows}×{area.cols} • {completed}/{total} holes
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    id={`btn-delete-area-${area.id}`}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm({
                        title: 'Delete Blasting Area',
                        content: `Delete "${area.name}"? This cannot be undone.`,
                        okText: 'Delete',
                        cancelText: 'Cancel',
                        danger: true,
                        onOk: () => deleteArea(area.id),
                      });
                    }}
                    title="Delete area"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 text-center">
            DrillOps v1.0 • Mining Operations
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
