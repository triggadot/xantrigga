
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SyncLayout from '@/components/sync/SyncLayout';
import SyncDashboard from '@/components/sync/SyncDashboard';
import ConnectionsManager from '@/components/sync/ConnectionsManager';
import MappingsManager from '@/components/sync/MappingsManager';
import SyncLogs from '@/components/sync/SyncLogs';

const Sync = () => {
  const navigate = useNavigate();
  const { tab } = useParams();

  useEffect(() => {
    if (!tab) {
      navigate('/sync/dashboard', { replace: true });
    }
  }, [tab, navigate]);

  return (
    <SyncLayout>
      {(() => {
        switch (tab) {
          case 'dashboard':
            return <SyncDashboard />;
          case 'connections':
            return <ConnectionsManager />;
          case 'mappings':
            return <MappingsManager />;
          case 'logs':
            return <SyncLogs />;
          default:
            return <SyncDashboard />;
        }
      })()}
    </SyncLayout>
  );
};

export default Sync;
