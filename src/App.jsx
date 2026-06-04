import { useState } from 'react';
import { App as AntApp, ConfigProvider, theme, message } from 'antd';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import StatsPanel from './components/StatsPanel';
import FilterBar from './components/FilterBar';
import HoleGrid from './components/HoleGrid';
import HoleModal from './components/HoleModal';
import CreateAreaModal from './components/CreateAreaModal';
import WelcomeScreen from './components/WelcomeScreen';
import useDrillStore from './store/useDrillStore';
import { exportToCSV } from './utils/exportCSV';
import { useActiveArea } from './hooks/useDrillSelectors';

function App() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const activeAreaId = useDrillStore((s) => s.activeAreaId);
  const area = useActiveArea();

  const handleExport = () => {
    if (!area) return;
    exportToCSV(area);
    message.success('Report exported successfully');
  };

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#f59e0b',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          colorBgContainer: '#1e293b',
          colorBgElevated: '#1e293b',
          colorBorder: '#334155',
          colorText: '#e2e8f0',
          colorTextSecondary: '#94a3b8',
        },
      }}
    >
      <AntApp className="w-full min-h-screen flex flex-1 flex-col">
        <div className="flex w-full flex-1 min-h-screen bg-[#0b1120]">
        {/* Sidebar */}
        <Sidebar onCreateArea={openCreateModal} />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar onExport={handleExport} />

          {activeAreaId && area ? (
            <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
              <StatsPanel />
              <FilterBar />
              <HoleGrid />
            </div>
          ) : (
            <WelcomeScreen onCreateArea={openCreateModal} />
          )}
        </main>
        </div>

        {/* Modals */}
        <HoleModal />
        <CreateAreaModal
          open={createModalOpen}
          onClose={closeCreateModal}
        />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
