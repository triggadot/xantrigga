import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGlSyncStatus } from '@/hooks/gl-sync';
import { useGlSync } from '@/hooks/gl-sync';
import { useIsMobile } from '@/hooks/utils/use-is-mobile';
// Remove SyncStatusBadge import as it's not used
import { GlSyncStatus } from '@/types/glsync';
import { debounce } from '@/utils/debounce-utils';
import { useToast } from '@/hooks/utils/use-toast';
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, XCircle, Loader2, Database, Info, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ActiveMappingCard from './ActiveMappingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * SyncOverview component displays a dashboard of sync mappings with status information
 * and provides filtering and sync operation capabilities
 */
export function SyncOverview() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { allSyncStatuses, isLoading, refreshData } = useGlSyncStatus();
  const { syncData } = useGlSync();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [syncingItems, setSyncingItems] = useState<Record<string, boolean>>({});

  // Calculate summary statistics
  const totalMappings = allSyncStatuses?.length || 0;
  const enabledMappings = allSyncStatuses?.filter(status => status.enabled)?.length || 0;
  const disabledMappings = totalMappings - enabledMappings;
  const hasErrors = allSyncStatuses?.filter(status => status.current_status === 'error')?.length || 0;
  const inProgress = allSyncStatuses?.filter(status => status.current_status === 'processing')?.length || 0;
  
  // Calculate sync health percentage
  const syncHealthPercentage = totalMappings > 0 
    ? Math.round(((totalMappings - hasErrors) / totalMappings) * 100) 
    : 100;

  // Debounced navigation to prevent multiple rapid navigations
  const debouncedNavigate = useCallback(
    debounce((path: string) => {
      navigate(path);
    }, 300),
    [navigate]
  );

  const handleSync = async (connectionId: string, mappingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Set syncing state for this item
    setSyncingItems(prev => ({ ...prev, [mappingId]: true }));
    
    try {
      await syncData(connectionId, mappingId);
      toast({
        title: "Sync initiated",
        description: "The sync process has been started successfully.",
      });
      
      // Refresh data after a short delay
      setTimeout(() => {
        refreshData();
      }, 2000);
    } catch (error) {
      toast({
        title: "Sync failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      // Clear syncing state after a short delay
      setTimeout(() => {
        setSyncingItems(prev => ({ ...prev, [mappingId]: false }));
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background shadow-sm">
          <CardContent className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Mappings</span>
              <Database className="h-4 w-4 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold">{totalMappings}</span>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-sm">
          <CardContent className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Mappings</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold">{enabledMappings}</span>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-sm">
          <CardContent className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Sync Errors</span>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold">{hasErrors}</span>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-background shadow-sm">
          <CardContent className="p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-semibold">{inProgress}</span>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Sync Health */}
      <Card className="bg-background shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Sync Health</span>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              syncHealthPercentage > 90 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
              syncHealthPercentage > 70 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {syncHealthPercentage}%
            </span>
          </div>
          <Progress 
            value={syncHealthPercentage} 
            className={cn(
              syncHealthPercentage > 90 ? "text-green-600" :
              syncHealthPercentage > 70 ? "text-yellow-600" :
              "text-red-600"
            )}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {hasErrors > 0 ? (
              <>
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                {hasErrors} mapping{hasErrors !== 1 ? 's' : ''} with errors detected
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3 w-3 inline-block mr-1" />
                All mappings are functioning properly
              </>
            )}
          </p>
        </CardContent>
      </Card>
      
      {/* Filter Controls */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
            All
          </Button>
          <Button
            variant={activeTab === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('success')}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Successful
          </Button>
          <Button
            variant={activeTab === 'processing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('processing')}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <Loader2 className="h-3.5 w-3.5 mr-1.5" />
            Processing
          </Button>
          <Button
            variant={activeTab === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('error')}
            className="text-xs sm:text-sm h-8 sm:h-9"
          >
            <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
            Failed
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isLoading}
          className="text-xs sm:text-sm h-8 sm:h-9"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          )}
          Refresh
        </Button>
      </div>
      
      {/* Mapping Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-[200px]">
                  <CardContent className="p-4">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <div className="flex justify-end gap-2 mt-4">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !allSyncStatuses || allSyncStatuses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Mappings Found</h3>
                <p className="text-muted-foreground">
                  Create a connection and set up table mappings to start synchronizing data.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSyncStatuses
                .filter(status => 
                  activeTab === 'all' ? true :
                  activeTab === 'success' ? status.current_status === 'success' :
                  activeTab === 'processing' ? status.current_status === 'processing' :
                  activeTab === 'error' ? status.current_status === 'error' :
                  true
                )
                .map((status) => (
                  <ActiveMappingCard
                    key={status.mapping_id}
                    status={status}
                    onSync={(connectionId, mappingId, e) => handleSync(connectionId, mappingId, e)}
                    isSyncing={syncingItems[status.mapping_id] || false}
                  />
                ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
