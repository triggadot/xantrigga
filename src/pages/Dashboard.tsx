
import React from 'react';
import { useBusinessOperations } from '@/hooks/useBusinessOperations';
import BusinessMetricsCard from '@/components/dashboard/BusinessMetricsCard';
import StatusMetricsCard from '@/components/dashboard/StatusMetricsCard';

const Dashboard: React.FC = () => {
  const { metrics, statusMetrics, isLoading } = useBusinessOperations();

  return (
    <div className="w-full py-4 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <BusinessMetricsCard metrics={metrics} isLoading={isLoading} />
      
      <StatusMetricsCard statusMetrics={statusMetrics} isLoading={isLoading} />
    </div>
  );
};

export default Dashboard;
