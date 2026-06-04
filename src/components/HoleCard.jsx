import { Tooltip } from 'antd';
import useDrillStore from '../store/useDrillStore';

/**
 * Single hole card in the grid.
 */
const HoleCard = ({ hole }) => {
  const selectedHoleId = useDrillStore((s) => s.selectedHoleId);
  const selectHole = useDrillStore((s) => s.selectHole);

  const isSelected = selectedHoleId === hole.id;

  const statusConfig = {
    empty: {
      className: 'hole-card--empty',
      badge: null,
      depthColor: 'text-slate-500',
    },
    completed: {
      className: 'hole-card--completed',
      badge: (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
      ),
      depthColor: 'text-emerald-400',
    },
    pending: {
      className: 'hole-card--pending',
      badge: (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
      ),
      depthColor: 'text-yellow-400',
    },
    error: {
      className: 'hole-card--error',
      badge: (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
      ),
      depthColor: 'text-red-400',
    },
  };

  const cfg = statusConfig[hole.status] || statusConfig.empty;

  const tooltipContent = (
    <div>
      <div className="font-semibold">{hole.id}</div>
      <div>Status: {hole.status}</div>
      {hole.depth !== null && <div>Depth: {hole.depth}m</div>}
      {hole.notes && <div>Notes: {hole.notes}</div>}
      {hole.updatedAt && (
        <div className="text-[10px] opacity-70 mt-1">
          Updated: {new Date(hole.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="top" mouseEnterDelay={0.4}>
      <div
        id={`hole-${hole.id}`}
        className={`hole-card ${cfg.className} ${isSelected ? 'hole-card--selected' : ''}`}
        onClick={() => selectHole(hole.id)}
        role="button"
        tabIndex={0}
        aria-label={`Hole ${hole.id}, status: ${hole.status}${hole.depth !== null ? `, depth: ${hole.depth}m` : ''}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectHole(hole.id);
          }
        }}
      >
        {cfg.badge}

        {/* Hole ID */}
        <span className="text-sm md:text-base font-bold text-slate-100 leading-none">
          {hole.id}
        </span>

        {/* Depth */}
        <span className={`text-xs md:text-sm font-medium leading-none ${cfg.depthColor}`}>
          {hole.depth !== null ? `${hole.depth}m` : '—'}
        </span>

        {/* Status label */}
        <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-slate-500 leading-none">
          {hole.status}
        </span>
      </div>
    </Tooltip>
  );
};

export default HoleCard;
