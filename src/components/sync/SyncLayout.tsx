
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';

interface SyncTab {
  id: string;
  label: string;
  path: string;
}

const tabs: SyncTab[] = [
  { id: 'overview', label: 'Overview', path: '/sync' },
  { id: 'connections', label: 'Connections', path: '/sync/connections' },
  { id: 'mappings', label: 'Mappings', path: '/sync/mappings' },
  { id: 'logs', label: 'Logs', path: '/sync/logs' }
];

const SyncLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine current tab based on path
  const currentTab = tabs.find(tab => 
    location.pathname === tab.path || 
    (tab.id !== 'overview' && location.pathname.startsWith(tab.path))
  )?.id || 'overview';

  const handleTabChange = (value: string) => {
    const selectedTab = tabs.find(tab => tab.id === value);
    if (selectedTab) {
      navigate(selectedTab.path);
    }
  };

  return (
    <div className="container mx-auto py-3 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Glide Sync</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor data synchronization between Glide and Supabase
          </p>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-2xl">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-4">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
};

export default SyncLayout;
