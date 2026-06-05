import { Input, Select } from 'antd';
import useDrillStore from '../store/useDrillStore';
import { useActiveArea } from '../hooks/useDrillSelectors';
import { useConfirmModal } from '../hooks/useConfirmModal';

/**
 * Search + Filter bar for the hole grid.
 */
const FilterBar = () => {
  const searchQuery = useDrillStore((s) => s.searchQuery);
  const statusFilter = useDrillStore((s) => s.statusFilter);
  const setSearchQuery = useDrillStore((s) => s.setSearchQuery);
  const setStatusFilter = useDrillStore((s) => s.setStatusFilter);
  const resetAllHoles = useDrillStore((s) => s.resetAllHoles);
  const { confirm } = useConfirmModal();
  const area = useActiveArea();
  if (!area) return null;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in">
      {/* Search */}
      <div className="flex-1 ">
        <Input
          className='w-[100px]'
          id="input-search-hole"
          placeholder="Search hole ID (e.g. A12)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          prefix={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-500">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          size="large"
        />
      </div>

      {/* Status filter */}
      <Select
        id="select-status-filter"
        value={statusFilter}
        onChange={(val) => setStatusFilter(val)}
        style={{ minWidth: 160 }}
        size="large"
        options={[
          { value: 'all', label: 'All Status' },
          { value: 'empty', label: '⬜ Empty' },
          { value: 'completed', label: '🟢 Completed' },
          { value: 'pending', label: '🟡 Pending' },
          { value: 'error', label: '🔴 Error' },
        ]}
      />

      {/* Reset all */}
      <button
        id="btn-reset-all"
        onClick={() => {
          confirm({
            title: 'Reset All Holes',
            content: 'Reset all holes in this area? All measurements will be cleared.',
            okText: 'Reset',
            cancelText: 'Cancel',
            danger: true,
            onOk: resetAllHoles,
          });
        }}
        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors border border-slate-700 hover:border-red-500/30 cursor-pointer whitespace-nowrap"
      >
        Reset All
      </button>
    </div>
  );
};

export default FilterBar;
