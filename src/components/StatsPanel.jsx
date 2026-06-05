import { Progress } from 'antd';
import { useStats } from '../hooks/useDrillSelectors';

/**
 * Stats panel — displays completion metrics and progress bar.
 */
const StatsPanel = () => {
  const stats = useStats();

  const statCards = [
    {
      label: 'Total Holes',
      value: stats.total,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Remaining',
      value: stats.empty + stats.pending,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Errors',
      value: stats.error,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center flex-shrink-0 ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100 leading-none">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass-card px-5 py-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400">Drilling Progress</span>
            <span className="text-sm font-bold text-amber-400">{stats.percentage}%</span>
          </div>
          <Progress
            percent={stats.percentage}
            showInfo={false}
            strokeColor={{
              '0%': '#f59e0b',
              '100%': '#10b981',
            }}
            railColor="rgba(71,85,105,0.4)"
            size="small"
          />
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-slate-100">
            {stats.completed}<span className="text-slate-500 font-normal">/{stats.total}</span>
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Holes Done</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
